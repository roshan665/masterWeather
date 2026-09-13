from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import decode_access_token
from ..models.user import UserModel
from ..repositories.user_repo import UserRepository

security_scheme = HTTPBearer(auto_error=False)

def get_db_session() -> Generator[Session, None, None]:
    yield from get_db()

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db_session)
) -> Optional[UserModel]:
    if not credentials:
        return None
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    user = UserRepository(db).get_by_id(user_id)
    return user

def require_current_user(user: Optional[UserModel] = Depends(get_current_user)) -> UserModel:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def require_role(allowed_roles: list[str]):
    def role_checker(user: UserModel = Depends(require_current_user)) -> UserModel:
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: role '{user.role}' not in allowed roles {allowed_roles}",
            )
        return user
    return role_checker
