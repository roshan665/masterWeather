import asyncio
import logging
from typing import Optional
from ..core.database import SessionLocal
from .weather_ingestion_service import WeatherIngestionService

logger = logging.getLogger("panchayatmausam.weather_pipeline")

class WeatherPipelineScheduler:
    """
    Background scheduler that triggers periodic weather data ingestion for Phanda block.
    """
    _task: Optional[asyncio.Task] = None
    _running: bool = False
    INTERVAL_SECONDS: int = 3600  # Run every 1 hour

    @classmethod
    async def start(cls):
        if cls._running:
            return
        cls._running = True
        cls._task = asyncio.create_task(cls._run_loop())
        logger.info("WeatherPipelineScheduler started (interval: %d seconds)", cls.INTERVAL_SECONDS)

    @classmethod
    async def stop(cls):
        cls._running = False
        if cls._task:
            cls._task.cancel()
            try:
                await cls._task
            except asyncio.CancelledError:
                pass
        logger.info("WeatherPipelineScheduler stopped.")

    @classmethod
    async def _run_loop(cls):
        # Initial small delay to let FastAPI application bootstrap completely
        await asyncio.sleep(3)
        while cls._running:
            try:
                db = SessionLocal()
                try:
                    service = WeatherIngestionService(db)
                    logger.info("Executing scheduled weather data ingestion for Phanda block Panchayats...")
                    res = service.ingest_all_panchayats(force_refresh=False, dry_run=False)
                    logger.info(
                        "Ingestion complete: %d records, quality score: %.1f%%, successful: %d/%d",
                        res["total_records_ingested"],
                        res["average_quality_score_pct"],
                        res["successful_panchayats"],
                        res["total_panchayats"]
                    )
                finally:
                    db.close()
            except Exception as e:
                logger.error("Error during scheduled weather ingestion: %s", str(e))
            
            # Wait until next interval or until cancelled
            try:
                await asyncio.sleep(cls.INTERVAL_SECONDS)
            except asyncio.CancelledError:
                break
