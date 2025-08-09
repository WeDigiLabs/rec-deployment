# Payload CMS Webhook System Documentation

## Overview

This webhook system is designed to automatically trigger HTTP requests to your FastAPI server whenever content is created or updated in Payload CMS. This enables real-time synchronization with external systems like vector databases for embedding and search functionality.

## How It Works

### 1. Webhook Hook Function

The system uses Payload CMS's built-in hook system with two main functions:

- `createWebhookHook(collectionSlug)`: For collection-level webhooks
- `createGlobalWebhookHook(globalSlug)`: For global-level webhooks

### 2. Webhook Triggers

Webhooks are triggered on:
- **Collections**: `create` and `update` operations
- **Globals**: `update` operations only (globals don't have create/delete)

### 3. Webhook Payload Structure

#### For Collections:
```json
{
  "collection": "collection-slug",
  "operation": "create|update",
  "data": { /* Full document data */ },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "document-id",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "Admin"
  }
}
```

#### For Globals:
```json
{
  "global": "global-slug",
  "operation": "update",
  "data": { /* Full global data */ },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "Admin"
  }
}
```

### 4. HTTP Headers

The webhook includes these headers:
- `Content-Type: application/json`
- `X-Webhook-Source: payload-cms`
- `X-Collection: collection-slug` (for collections)
- `X-Global: global-slug` (for globals)
- `X-Operation: create|update`

## Configuration

### Environment Variables

Add to your `.env` file:
```bash
WEBHOOK_URL=http://localhost:8000/webhook/payload
```

Default URL if not specified: `http://localhost:8000/webhook/payload`

### Enabled Collections

All collections have webhooks enabled:
- `announcements`
- `blog-posts`
- `testimonials`
- `coe`
- `coe-categories`
- `departments`
- `department-sections`
- `secondary-nav`
- `dynamic-pages`
- `home-slider`
- `media`
- `admissions`
- `users`

### Enabled Globals

All globals have webhooks enabled:
- `about`
- `admissions`
- `research`
- `placement`
- `international-relations`
- `academics`
- `student-life`
- `regulations`

## Implementation Details

### Error Handling

- Webhook failures are logged but don't break the main CMS operation
- Failed webhooks log error details to console
- Successful webhooks log confirmation messages

### Security Considerations

- Configure your FastAPI server to validate webhook source
- Consider implementing webhook signatures for security
- Use HTTPS in production environments
- Restrict webhook URL access in firewall rules

## FastAPI Server Requirements

Your FastAPI server should:

1. **Accept POST requests** at the configured webhook URL
2. **Handle JSON payloads** with the structure described above
3. **Process different content types** based on collection/global type
4. **Implement embedding generation** for text content
5. **Store vectors** in your chosen vector database
6. **Return appropriate HTTP status codes**

## Example Usage

See `fastapi_webhook_example.py` for a complete example implementation.

## Troubleshooting

### Common Issues

1. **Webhook not firing**: Check console logs for errors in the webhook function
2. **Connection refused**: Ensure your FastAPI server is running on the configured URL
3. **Timeout errors**: Increase timeout in your FastAPI server or optimize processing
4. **Memory issues**: Implement async processing for large documents

### Debugging

Enable detailed logging by checking the console output in your Payload CMS application. Webhook status messages will appear as:

```
Sending webhook for announcements create: 60f7b3b3b3b3b3b3b3b3b3b3
Webhook sent successfully for announcements create
```

Or for errors:
```
Webhook failed for announcements: 500 Internal Server Error
Webhook error for announcements: Error message details
```

## Performance Considerations

- Webhooks are fire-and-forget to avoid blocking CMS operations
- Consider implementing a queue system for heavy processing
- Use async processing in your FastAPI server
- Monitor webhook endpoint performance
- Implement retry logic for failed webhook deliveries

## Future Enhancements

Potential improvements to consider:
- Webhook signature verification
- Retry mechanism with exponential backoff
- Webhook delivery status tracking
- Selective field updates (only send changed fields)
- Batch webhook processing for bulk operations
