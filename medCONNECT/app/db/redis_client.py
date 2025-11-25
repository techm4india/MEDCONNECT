"""
Redis client for caching and session management
"""
from typing import Optional, Any
import json
import redis
from app.core.config import settings
from loguru import logger


class RedisClient:
    """Redis client wrapper"""
    
    def __init__(self):
        self.client: Optional[redis.Redis] = None
        self._initialize()
    
    def _initialize(self):
        """Initialize Redis client"""
        try:
            self.client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=settings.REDIS_DB,
                password=settings.REDIS_PASSWORD if settings.REDIS_PASSWORD else None,
                decode_responses=True
            )
            # Test connection
            self.client.ping()
            logger.info("Redis client initialized successfully")
        except Exception as e:
            logger.warning(f"Redis connection failed: {e}. Continuing without cache.")
            self.client = None
    
    def get_client(self) -> Optional[redis.Redis]:
        """Get Redis client instance"""
        if self.client is None:
            self._initialize()
        return self.client
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.client:
            return None
        
        try:
            value = self.client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logger.error(f"Redis get error: {e}")
            return None
    
    def set(
        self,
        key: str,
        value: Any,
        expire: Optional[int] = None
    ) -> bool:
        """Set value in cache"""
        if not self.client:
            return False
        
        try:
            serialized = json.dumps(value)
            if expire:
                return self.client.setex(key, expire, serialized)
            return self.client.set(key, serialized)
        except Exception as e:
            logger.error(f"Redis set error: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if not self.client:
            return False
        
        try:
            return bool(self.client.delete(key))
        except Exception as e:
            logger.error(f"Redis delete error: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """Check if key exists"""
        if not self.client:
            return False
        
        try:
            return bool(self.client.exists(key))
        except Exception as e:
            logger.error(f"Redis exists error: {e}")
            return False
    
    def increment(self, key: str, amount: int = 1) -> Optional[int]:
        """Increment a counter"""
        if not self.client:
            return None
        
        try:
            return self.client.incrby(key, amount)
        except Exception as e:
            logger.error(f"Redis increment error: {e}")
            return None
    
    def expire(self, key: str, seconds: int) -> bool:
        """Set expiration on a key"""
        if not self.client:
            return False
        
        try:
            return bool(self.client.expire(key, seconds))
        except Exception as e:
            logger.error(f"Redis expire error: {e}")
            return False


# Global instance
redis_client = RedisClient()





