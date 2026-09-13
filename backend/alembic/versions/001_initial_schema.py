"""Initial database schema for PanchayatMausam AI

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-13 08:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Panchayats
    op.create_table(
        'panchayats',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('name_en', sa.String(length=128), nullable=False),
        sa.Column('name_hi', sa.String(length=128), nullable=False),
        sa.Column('district_en', sa.String(length=64), nullable=True),
        sa.Column('district_hi', sa.String(length=64), nullable=True),
        sa.Column('block_en', sa.String(length=64), nullable=True),
        sa.Column('block_hi', sa.String(length=64), nullable=True),
        sa.Column('state_en', sa.String(length=64), nullable=True),
        sa.Column('state_hi', sa.String(length=64), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('elevation_m', sa.Float(), nullable=True),
        sa.Column('weather_station_id', sa.String(length=64), nullable=False),
        sa.Column('soil_type_en', sa.String(length=128), nullable=True),
        sa.Column('soil_type_hi', sa.String(length=128), nullable=True),
        sa.Column('bbox_json', sa.Text(), nullable=True),
        sa.Column('boundary_geojson', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_panchayats_id'), 'panchayats', ['id'], unique=False)

    # 2. Crops
    op.create_table(
        'crops',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('name_en', sa.String(length=128), nullable=False),
        sa.Column('name_hi', sa.String(length=128), nullable=False),
        sa.Column('botanical_name', sa.String(length=128), nullable=False),
        sa.Column('season', sa.String(length=32), nullable=False),
        sa.Column('season_name_en', sa.String(length=64), nullable=False),
        sa.Column('season_name_hi', sa.String(length=64), nullable=False),
        sa.Column('typical_sowing_window_en', sa.String(length=128), nullable=False),
        sa.Column('typical_sowing_window_hi', sa.String(length=128), nullable=False),
        sa.Column('total_duration_days', sa.Integer(), nullable=False),
        sa.Column('icon', sa.String(length=16), nullable=True),
        sa.Column('primary_risks_en_json', sa.Text(), nullable=True),
        sa.Column('primary_risks_hi_json', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_crops_id'), 'crops', ['id'], unique=False)

    # 3. Crop Stages
    op.create_table(
        'crop_stages',
        sa.Column('stage_id', sa.String(length=64), nullable=False),
        sa.Column('crop_id', sa.String(length=64), nullable=False),
        sa.Column('stage_order', sa.Integer(), nullable=False),
        sa.Column('name_en', sa.String(length=128), nullable=False),
        sa.Column('name_hi', sa.String(length=128), nullable=False),
        sa.Column('typical_duration_days', sa.Integer(), nullable=False),
        sa.Column('water_sensitivity', sa.String(length=32), nullable=True),
        sa.Column('thermal_sensitivity', sa.String(length=32), nullable=True),
        sa.Column('critical_triggers_json', sa.Text(), nullable=True),
        sa.Column('description_en', sa.Text(), nullable=True),
        sa.Column('description_hi', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['crop_id'], ['crops.id'], ),
        sa.PrimaryKeyConstraint('stage_id')
    )
    op.create_index(op.f('ix_crop_stages_crop_id'), 'crop_stages', ['crop_id'], unique=False)
    op.create_index(op.f('ix_crop_stages_stage_id'), 'crop_stages', ['stage_id'], unique=False)

    # 4. Users
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('username', sa.String(length=64), nullable=False),
        sa.Column('password_hash', sa.String(length=256), nullable=False),
        sa.Column('name_en', sa.String(length=128), nullable=False),
        sa.Column('name_hi', sa.String(length=128), nullable=False),
        sa.Column('role', sa.String(length=32), nullable=False),
        sa.Column('email', sa.String(length=128), nullable=False),
        sa.Column('phone', sa.String(length=32), nullable=True),
        sa.Column('avatar_url', sa.String(length=256), nullable=True),
        sa.Column('panchayat_id', sa.String(length=64), nullable=True),
        sa.Column('panchayat_name_en', sa.String(length=128), nullable=True),
        sa.Column('panchayat_name_hi', sa.String(length=128), nullable=True),
        sa.Column('village_name_en', sa.String(length=128), nullable=True),
        sa.Column('village_name_hi', sa.String(length=128), nullable=True),
        sa.Column('designation_en', sa.String(length=128), nullable=True),
        sa.Column('designation_hi', sa.String(length=128), nullable=True),
        sa.Column('organization_en', sa.String(length=128), nullable=True),
        sa.Column('organization_hi', sa.String(length=128), nullable=True),
        sa.Column('permissions_json', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.Column('last_login_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)

    # 5. Weather Readings
    op.create_table(
        'weather_readings',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('panchayat_id', sa.String(length=64), nullable=False),
        sa.Column('station_id', sa.String(length=64), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('temp_c', sa.Float(), nullable=False),
        sa.Column('temp_max_c', sa.Float(), nullable=False),
        sa.Column('temp_min_c', sa.Float(), nullable=False),
        sa.Column('feels_like_c', sa.Float(), nullable=False),
        sa.Column('dew_point_c', sa.Float(), nullable=False),
        sa.Column('rainfall_mm', sa.Float(), nullable=False),
        sa.Column('rainfall_rate_mm_hr', sa.Float(), nullable=True),
        sa.Column('humidity_pct', sa.Float(), nullable=False),
        sa.Column('wind_speed_kmh', sa.Float(), nullable=False),
        sa.Column('wind_direction_deg', sa.Float(), nullable=False),
        sa.Column('wind_direction_cardinal', sa.String(length=8), nullable=True),
        sa.Column('pressure_hpa', sa.Float(), nullable=True),
        sa.Column('solar_radiation_wm2', sa.Float(), nullable=True),
        sa.Column('et0_mm_day', sa.Float(), nullable=True),
        sa.Column('leaf_wetness_pct', sa.Float(), nullable=True),
        sa.Column('soil_moisture_pct', sa.Float(), nullable=True),
        sa.Column('soil_temp_c', sa.Float(), nullable=True),
        sa.Column('confidence_pct', sa.Float(), nullable=True),
        sa.Column('data_source', sa.String(length=64), nullable=True),
        sa.ForeignKeyConstraint(['panchayat_id'], ['panchayats.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_weather_readings_id'), 'weather_readings', ['id'], unique=False)
    op.create_index(op.f('ix_weather_readings_panchayat_id'), 'weather_readings', ['panchayat_id'], unique=False)
    op.create_index(op.f('ix_weather_readings_timestamp'), 'weather_readings', ['timestamp'], unique=False)

    # 6. Hourly Forecasts
    op.create_table(
        'hourly_forecasts',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('panchayat_id', sa.String(length=64), nullable=False),
        sa.Column('forecast_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('temp_c', sa.Float(), nullable=False),
        sa.Column('rain_probability_pct', sa.Float(), nullable=False),
        sa.Column('rain_amount_mm', sa.Float(), nullable=True),
        sa.Column('rh_pct', sa.Float(), nullable=False),
        sa.Column('wind_speed_kmh', sa.Float(), nullable=False),
        sa.Column('spray_feasibility', sa.String(length=32), nullable=True),
        sa.Column('spray_advice_en', sa.Text(), nullable=True),
        sa.Column('spray_advice_hi', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['panchayat_id'], ['panchayats.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_hourly_forecasts_id'), 'hourly_forecasts', ['id'], unique=False)
    op.create_index(op.f('ix_hourly_forecasts_panchayat_id'), 'hourly_forecasts', ['panchayat_id'], unique=False)
    op.create_index(op.f('ix_hourly_forecasts_forecast_time'), 'hourly_forecasts', ['forecast_time'], unique=False)

    # 7. Daily Forecasts
    op.create_table(
        'daily_forecasts',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('panchayat_id', sa.String(length=64), nullable=False),
        sa.Column('forecast_date', sa.String(length=16), nullable=False),
        sa.Column('temp_max_c', sa.Float(), nullable=False),
        sa.Column('temp_min_c', sa.Float(), nullable=False),
        sa.Column('rainfall_mm', sa.Float(), nullable=False),
        sa.Column('rain_probability_pct', sa.Float(), nullable=False),
        sa.Column('condition_code', sa.String(length=32), nullable=True),
        sa.Column('condition_text_en', sa.String(length=128), nullable=True),
        sa.Column('condition_text_hi', sa.String(length=128), nullable=True),
        sa.Column('wind_speed_kmh', sa.Float(), nullable=True),
        sa.Column('rh_avg_pct', sa.Float(), nullable=True),
        sa.Column('confidence_level', sa.String(length=16), nullable=True),
        sa.Column('confidence_pct', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['panchayat_id'], ['panchayats.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_daily_forecasts_id'), 'daily_forecasts', ['id'], unique=False)
    op.create_index(op.f('ix_daily_forecasts_panchayat_id'), 'daily_forecasts', ['panchayat_id'], unique=False)
    op.create_index(op.f('ix_daily_forecasts_forecast_date'), 'daily_forecasts', ['forecast_date'], unique=False)

    # 8. Crop Risk Assessments
    op.create_table(
        'crop_risk_assessments',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('panchayat_id', sa.String(length=64), nullable=False),
        sa.Column('crop_id', sa.String(length=64), nullable=False),
        sa.Column('stage_id', sa.String(length=64), nullable=False),
        sa.Column('assessment_date', sa.String(length=16), nullable=False),
        sa.Column('overall_risk_score', sa.Float(), nullable=False),
        sa.Column('overall_risk_level', sa.String(length=32), nullable=False),
        sa.Column('sub_risks_json', sa.Text(), nullable=True),
        sa.Column('stage_sensitivities_json', sa.Text(), nullable=True),
        sa.Column('summary_en', sa.Text(), nullable=False),
        sa.Column('summary_hi', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.ForeignKeyConstraint(['crop_id'], ['crops.id'], ),
        sa.ForeignKeyConstraint(['panchayat_id'], ['panchayats.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_crop_risk_assessments_id'), 'crop_risk_assessments', ['id'], unique=False)
    op.create_index(op.f('ix_crop_risk_assessments_panchayat_id'), 'crop_risk_assessments', ['panchayat_id'], unique=False)
    op.create_index(op.f('ix_crop_risk_assessments_crop_id'), 'crop_risk_assessments', ['crop_id'], unique=False)

    # 9. Advisory Rules (Knowledge Base)
    op.create_table(
        'advisory_rules',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('rule_code', sa.String(length=64), nullable=False),
        sa.Column('crop_id', sa.String(length=64), nullable=False),
        sa.Column('crop_name_en', sa.String(length=128), nullable=False),
        sa.Column('crop_name_hi', sa.String(length=128), nullable=False),
        sa.Column('stage_id', sa.String(length=64), nullable=False),
        sa.Column('stage_name_en', sa.String(length=128), nullable=False),
        sa.Column('stage_name_hi', sa.String(length=128), nullable=False),
        sa.Column('weather_trigger_en', sa.Text(), nullable=False),
        sa.Column('weather_trigger_hi', sa.Text(), nullable=False),
        sa.Column('thresholds_json', sa.Text(), nullable=False),
        sa.Column('threshold_description_en', sa.String(length=256), nullable=True),
        sa.Column('threshold_description_hi', sa.String(length=256), nullable=True),
        sa.Column('risk_category', sa.String(length=64), nullable=False),
        sa.Column('severity', sa.String(length=32), nullable=False),
        sa.Column('short_summary_en', sa.String(length=256), nullable=False),
        sa.Column('short_summary_hi', sa.String(length=256), nullable=False),
        sa.Column('recommended_action_en', sa.Text(), nullable=False),
        sa.Column('recommended_action_hi', sa.Text(), nullable=False),
        sa.Column('source_org_en', sa.String(length=256), nullable=False),
        sa.Column('source_org_hi', sa.String(length=256), nullable=False),
        sa.Column('source_ref_en', sa.String(length=256), nullable=False),
        sa.Column('source_ref_hi', sa.String(length=256), nullable=False),
        sa.Column('version', sa.String(length=32), nullable=True),
        sa.Column('approval_status', sa.String(length=32), nullable=True),
        sa.Column('effective_from', sa.String(length=16), nullable=False),
        sa.Column('effective_until', sa.String(length=16), nullable=False),
        sa.Column('created_by', sa.String(length=128), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.Column('reviewer', sa.String(length=128), nullable=True),
        sa.Column('reviewed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('review_notes', sa.Text(), nullable=True),
        sa.Column('version_history_json', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['crop_id'], ['crops.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_advisory_rules_id'), 'advisory_rules', ['id'], unique=False)
    op.create_index(op.f('ix_advisory_rules_rule_code'), 'advisory_rules', ['rule_code'], unique=True)
    op.create_index(op.f('ix_advisory_rules_crop_id'), 'advisory_rules', ['crop_id'], unique=False)

    # 10. Agromet Advisories (Operational)
    op.create_table(
        'agromet_advisories',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('advisory_code', sa.String(length=64), nullable=False),
        sa.Column('panchayat_id', sa.String(length=64), nullable=False),
        sa.Column('panchayat_name_en', sa.String(length=128), nullable=False),
        sa.Column('panchayat_name_hi', sa.String(length=128), nullable=False),
        sa.Column('crop_id', sa.String(length=64), nullable=False),
        sa.Column('crop_name_en', sa.String(length=128), nullable=False),
        sa.Column('crop_name_hi', sa.String(length=128), nullable=False),
        sa.Column('stage_id', sa.String(length=64), nullable=False),
        sa.Column('stage_name_en', sa.String(length=128), nullable=False),
        sa.Column('stage_name_hi', sa.String(length=128), nullable=False),
        sa.Column('headline_en', sa.String(length=256), nullable=False),
        sa.Column('headline_hi', sa.String(length=256), nullable=False),
        sa.Column('detailed_advice_en', sa.Text(), nullable=False),
        sa.Column('detailed_advice_hi', sa.Text(), nullable=False),
        sa.Column('action_type', sa.String(length=64), nullable=True),
        sa.Column('risk_category', sa.String(length=64), nullable=True),
        sa.Column('severity', sa.String(length=32), nullable=True),
        sa.Column('approval_status', sa.String(length=32), nullable=True),
        sa.Column('helpful_count', sa.Integer(), nullable=True),
        sa.Column('unhelpful_count', sa.Integer(), nullable=True),
        sa.Column('author_name', sa.String(length=128), nullable=True),
        sa.Column('approved_by', sa.String(length=128), nullable=True),
        sa.Column('approved_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('source_citation_en', sa.String(length=256), nullable=True),
        sa.Column('source_citation_hi', sa.String(length=256), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.ForeignKeyConstraint(['crop_id'], ['crops.id'], ),
        sa.ForeignKeyConstraint(['panchayat_id'], ['panchayats.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_agromet_advisories_id'), 'agromet_advisories', ['id'], unique=False)
    op.create_index(op.f('ix_agromet_advisories_advisory_code'), 'agromet_advisories', ['advisory_code'], unique=True)
    op.create_index(op.f('ix_agromet_advisories_panchayat_id'), 'agromet_advisories', ['panchayat_id'], unique=False)

    # 11. Farmer Observations
    op.create_table(
        'farmer_observations',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('panchayat_id', sa.String(length=64), nullable=False),
        sa.Column('panchayat_name_en', sa.String(length=128), nullable=False),
        sa.Column('panchayat_name_hi', sa.String(length=128), nullable=False),
        sa.Column('village_name_en', sa.String(length=128), nullable=False),
        sa.Column('village_name_hi', sa.String(length=128), nullable=False),
        sa.Column('farmer_name', sa.String(length=128), nullable=False),
        sa.Column('farmer_phone', sa.String(length=32), nullable=True),
        sa.Column('crop_id', sa.String(length=64), nullable=False),
        sa.Column('crop_name_en', sa.String(length=128), nullable=False),
        sa.Column('crop_name_hi', sa.String(length=128), nullable=False),
        sa.Column('stage_id', sa.String(length=64), nullable=True),
        sa.Column('stage_name_en', sa.String(length=128), nullable=True),
        sa.Column('stage_name_hi', sa.String(length=128), nullable=True),
        sa.Column('category', sa.String(length=64), nullable=False),
        sa.Column('description_en', sa.Text(), nullable=False),
        sa.Column('description_hi', sa.Text(), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('image_url', sa.String(length=256), nullable=True),
        sa.Column('status', sa.String(length=32), nullable=True),
        sa.Column('reviewed_by', sa.String(length=128), nullable=True),
        sa.Column('review_notes_en', sa.Text(), nullable=True),
        sa.Column('review_notes_hi', sa.Text(), nullable=True),
        sa.Column('submitted_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.Column('reviewed_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['crop_id'], ['crops.id'], ),
        sa.ForeignKeyConstraint(['panchayat_id'], ['panchayats.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_farmer_observations_id'), 'farmer_observations', ['id'], unique=False)
    op.create_index(op.f('ix_farmer_observations_panchayat_id'), 'farmer_observations', ['panchayat_id'], unique=False)

    # 12. Weather Alerts
    op.create_table(
        'weather_alerts',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('alert_code', sa.String(length=64), nullable=False),
        sa.Column('severity', sa.String(length=32), nullable=False),
        sa.Column('category', sa.String(length=64), nullable=False),
        sa.Column('headline_en', sa.String(length=256), nullable=False),
        sa.Column('headline_hi', sa.String(length=256), nullable=False),
        sa.Column('detailed_instruction_en', sa.Text(), nullable=False),
        sa.Column('detailed_instruction_hi', sa.Text(), nullable=False),
        sa.Column('target_panchayat_ids_json', sa.Text(), nullable=False),
        sa.Column('target_panchayat_names_en', sa.String(length=256), nullable=False),
        sa.Column('target_panchayat_names_hi', sa.String(length=256), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('issued_by', sa.String(length=128), nullable=True),
        sa.Column('issued_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.Column('valid_from', sa.String(length=32), nullable=False),
        sa.Column('valid_until', sa.String(length=32), nullable=False),
        sa.Column('sms_delivery_status', sa.String(length=64), nullable=True),
        sa.Column('push_delivery_status', sa.String(length=64), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_weather_alerts_id'), 'weather_alerts', ['id'], unique=False)
    op.create_index(op.f('ix_weather_alerts_alert_code'), 'weather_alerts', ['alert_code'], unique=True)

    # 13. Feedbacks
    op.create_table(
        'feedbacks',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('advisory_id', sa.String(length=64), nullable=True),
        sa.Column('panchayat_id', sa.String(length=64), nullable=True),
        sa.Column('farmer_name', sa.String(length=128), nullable=True),
        sa.Column('phone', sa.String(length=32), nullable=True),
        sa.Column('rating', sa.Integer(), nullable=True),
        sa.Column('is_useful', sa.Boolean(), nullable=True),
        sa.Column('is_understandable', sa.Boolean(), nullable=True),
        sa.Column('is_relevant', sa.Boolean(), nullable=True),
        sa.Column('comments', sa.Text(), nullable=True),
        sa.Column('submitted_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_feedbacks_id'), 'feedbacks', ['id'], unique=False)

    # 14. Audit Logs
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.Column('user_id', sa.String(length=64), nullable=False),
        sa.Column('user_name', sa.String(length=128), nullable=False),
        sa.Column('user_role', sa.String(length=32), nullable=False),
        sa.Column('action', sa.String(length=64), nullable=False),
        sa.Column('target_entity', sa.String(length=64), nullable=False),
        sa.Column('target_id', sa.String(length=64), nullable=False),
        sa.Column('details', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=32), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_audit_logs_id'), 'audit_logs', ['id'], unique=False)
    op.create_index(op.f('ix_audit_logs_timestamp'), 'audit_logs', ['timestamp'], unique=False)


def downgrade() -> None:
    op.drop_table('audit_logs')
    op.drop_table('feedbacks')
    op.drop_table('weather_alerts')
    op.drop_table('farmer_observations')
    op.drop_table('agromet_advisories')
    op.drop_table('advisory_rules')
    op.drop_table('crop_risk_assessments')
    op.drop_table('daily_forecasts')
    op.drop_table('hourly_forecasts')
    op.drop_table('weather_readings')
    op.drop_table('users')
    op.drop_table('crop_stages')
    op.drop_table('crops')
    op.drop_table('panchayats')
