"""
Supabase client integration
"""
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from app.core.config import settings
from loguru import logger
import httpx


class SupabaseClient:
    """Supabase database client wrapper"""
    
    def __init__(self):
        self.client: Optional[Client] = None
        self._initialize()
    
    def _initialize(self):
        """Initialize Supabase client"""
        try:
            if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
                logger.warning("Supabase credentials not configured. Some features may not work.")
                self.client = None
                return
            
            # Validate URL format
            url = settings.SUPABASE_URL.strip()
            if not url.startswith(("http://", "https://")):
                logger.error(f"Invalid SUPABASE_URL format. Must start with http:// or https://. Current value: {url[:50]}...")
                if settings.APP_ENV == "production":
                    raise ValueError("Invalid SUPABASE_URL format")
                self.client = None
                return
            
            logger.info(f"Initializing Supabase client with URL: {url.split('//')[1].split('/')[0] if '//' in url else 'unknown'}")
            self.client = create_client(
                url,
                settings.SUPABASE_SERVICE_ROLE_KEY
            )
            logger.info("Supabase client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            if settings.APP_ENV == "production":
                raise
            else:
                logger.warning("Continuing without Supabase in development mode")
                self.client = None
    
    def get_client(self) -> Client:
        """Get Supabase client instance"""
        if self.client is None:
            self._initialize()
        if self.client is None:
            error_msg = (
                "Supabase client not initialized. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file. "
                f"Current SUPABASE_URL: {'Set' if settings.SUPABASE_URL else 'Not set'}"
            )
            raise ValueError(error_msg)
        return self.client
    
    def _handle_connection_error(self, e: Exception, operation: str) -> None:
        """Handle connection errors consistently"""
        error_msg = (
            f"Failed to connect to Supabase during {operation}. "
            f"Please check:\n"
            f"1. SUPABASE_URL is correctly set in .env file (current: {'Set' if settings.SUPABASE_URL else 'Not set'})\n"
            f"2. Network connectivity\n"
            f"3. Supabase service is running\n"
            f"Error: {str(e)}"
        )
        logger.error(error_msg)
        if settings.APP_ENV == "production":
            raise ConnectionError(error_msg) from e
        else:
            logger.warning(f"Continuing in development mode despite Supabase connection failure during {operation}")
    
    # Generic CRUD operations
    
    def select(
        self,
        table: str,
        columns: str = "*",
        filters: Optional[Dict[str, Any]] = None,
        order_by: Optional[str] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """Select data from a table"""
        try:
            client = self.get_client()
            query = client.table(table).select(columns)
            
            if filters:
                for key, value in filters.items():
                    if isinstance(value, list):
                        query = query.in_(key, value)
                    else:
                        query = query.eq(key, value)
            
            if order_by:
                query = query.order(order_by)
            
            if limit:
                query = query.limit(limit)
            
            if offset:
                query = query.offset(offset)
            
            response = query.execute()
            return response.data if response.data else []
        except (httpx.ConnectError, httpx.ConnectTimeout, httpx.NetworkError) as e:
            self._handle_connection_error(e, "select operation")
            return []
    
    def select_one(
        self,
        table: str,
        filters: Optional[Dict[str, Any]] = None
    ) -> Optional[Dict[str, Any]]:
        """Select a single record"""
        results = self.select(table, filters=filters, limit=1)
        return results[0] if results else None
    
    def insert(
        self,
        table: str,
        data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Insert a record"""
        client = self.get_client()
        response = client.table(table).insert(data).execute()
        return response.data[0] if response.data else {}
    
    def insert_many(
        self,
        table: str,
        data: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Insert multiple records"""
        client = self.get_client()
        response = client.table(table).insert(data).execute()
        return response.data if response.data else []
    
    def update(
        self,
        table: str,
        data: Dict[str, Any],
        filters: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update records"""
        client = self.get_client()
        query = client.table(table).update(data)
        
        for key, value in filters.items():
            query = query.eq(key, value)
        
        response = query.execute()
        return response.data[0] if response.data else {}
    
    def delete(
        self,
        table: str,
        filters: Dict[str, Any]
    ) -> bool:
        """Delete records"""
        client = self.get_client()
        query = client.table(table).delete()
        
        for key, value in filters.items():
            query = query.eq(key, value)
        
        response = query.execute()
        return True
    
    def count(
        self,
        table: str,
        filters: Optional[Dict[str, Any]] = None
    ) -> int:
        """Count records"""
        client = self.get_client()
        query = client.table(table).select("*", count="exact")
        
        if filters:
            for key, value in filters.items():
                query = query.eq(key, value)
        
        response = query.execute()
        return response.count if response.count else 0
    
    # Storage operations
    
    def upload_file(
        self,
        bucket: str,
        path: str,
        file_data: bytes,
        content_type: str = "application/octet-stream"
    ) -> Dict[str, Any]:
        """Upload a file to Supabase storage"""
        client = self.get_client()
        response = client.storage.from_(bucket).upload(
            path=path,
            file=file_data,
            file_options={"content-type": content_type}
        )
        return response
    
    def get_file_url(
        self,
        bucket: str,
        path: str,
        expires_in: int = 3600
    ) -> str:
        """Get a signed URL for a file"""
        client = self.get_client()
        response = client.storage.from_(bucket).create_signed_url(
            path=path,
            expires_in=expires_in
        )
        return response.get("signedURL", "")
    
    def delete_file(
        self,
        bucket: str,
        path: str
    ) -> bool:
        """Delete a file from storage"""
        client = self.get_client()
        response = client.storage.from_(bucket).remove([path])
        return True


# Global instance
supabase_client = SupabaseClient()



