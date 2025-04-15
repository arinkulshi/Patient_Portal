# Patient Portal API Documentation

## Overview

The Patient Portal API provides endpoints to access and manage patient medical reports. This API allows filtering reports by patient name and other criteria, and includes proper pagination for handling large datasets.

## Base URL

```
http://localhost:3001/api/v1
```

## Authentication

Authentication is not required for this API (as per project constraints).

## Response Format

All responses are returned in JSON format. Successful responses typically include the requested data, while error responses include an error code and message.

### Success Response Format

```json
{
  "data": [...],  // Array of reports or single report object
  "total": 12,    // Total number of reports matching the filter
  "page": 1,      // Current page number
  "limit": 10,    // Number of items per page
  "totalPages": 2 // Total number of pages
}
```

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Description of the error",
    "timestamp": "2025-04-11T14:30:45.123Z"
  }
}
```

## Common Error Codes

- `RESOURCE_NOT_FOUND`: The requested resource was not found
- `VALIDATION_ERROR`: The request contains invalid data
- `INVALID_PARAMETER`: A request parameter is invalid
- `MISSING_PARAMETER`: A required parameter is missing
- `INTERNAL_ERROR`: An unexpected server error occurred

## Endpoints

### Get All Reports

Retrieves a list of reports, with optional filtering and pagination.

```
GET /reports
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| patientName | string | Filter reports by patient name (case-insensitive partial match) |
| patientId | string | Filter reports by patient ID (exact match) |
| type | string | Filter reports by type (e.g., "Lab", "Radiology", "General") |
| fromDate | string | Filter reports with date on or after this date (ISO format) |
| toDate | string | Filter reports with date on or before this date (ISO format) |
| limit | number | Number of reports to return per page (default: 10, max: 100) |
| offset | number | Number of reports to skip (for pagination, default: 0) |
| sortBy | string | Field to sort by (default: 'date') |
| sortDirection | string | Sort direction ('asc' or 'desc', default: 'desc') |

#### Example Request

```
GET /reports?patientName=John&limit=5&offset=0
```

#### Example Response

```json
{
  "data": [
    {
      "id": "1",
      "patientName": "John Smith",
      "patientId": "P001",
      "date": "2025-03-15T10:30:00Z",
      "summary": "Patient presented with mild fever and cough. Chest X-ray shows no signs of pneumonia.",
      "type": "General",
      "createdAt": "2025-03-15T10:30:00Z",
      "updatedAt": "2025-03-15T10:30:00Z"
    },
    {
      "id": "7",
      "patientName": "John Smith",
      "patientId": "P001",
      "date": "2025-02-28T09:00:00Z",
      "summary": "Follow-up for respiratory infection. Symptoms have improved.",
      "type": "Pulmonology",
      "createdAt": "2025-02-28T09:00:00Z",
      "updatedAt": "2025-02-28T09:00:00Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 5,
  "totalPages": 1
}
```

### Get Report by ID

Retrieves a specific report by its ID.

```
GET /reports/:id
```

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Report unique identifier |

#### Example Request

```
GET /reports/1
```

#### Example Response

```json
{
  "id": "1",
  "patientName": "John Smith",
  "patientId": "P001",
  "date": "2025-03-15T10:30:00Z",
  "summary": "Patient presented with mild fever and cough. Chest X-ray shows no signs of pneumonia.",
  "type": "General",
  "createdAt": "2025-03-15T10:30:00Z",
  "updatedAt": "2025-03-15T10:30:00Z"
}
```

### Create New Report

Creates a new patient report.

```
POST /reports
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| patientName | string | Yes | Name of the patient |
| patientId | string | No | Patient's unique identifier |
| date | string | No | Report date (ISO format, defaults to current date) |
| summary | string | Yes | Report summary text |
| type | string | No | Report type (defaults to "General") |

#### Example Request

```json
{
  "patientName": "Jane Wilson",
  "patientId": "P011",
  "summary": "Annual checkup. Patient is in good health with no significant findings.",
  "type": "General"
}
```

#### Example Response

```json
{
  "message": "Report created successfully",
  "data": {
    "id": "13",
    "patientName": "Jane Wilson",
    "patientId": "P011",
    "date": "2025-04-11T14:30:45.123Z",
    "summary": "Annual checkup. Patient is in good health with no significant findings.",
    "type": "General",
    "createdAt": "2025-04-11T14:30:45.123Z",
    "updatedAt": "2025-04-11T14:30:45.123Z"
  }
}
```

### Update Report

Updates an existing report.

```
PUT /reports/:id
```

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Report unique identifier |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| patientName | string | No | Name of the patient |
| patientId | string | No | Patient's unique identifier |
| date | string | No | Report date (ISO format) |
| summary | string | No | Report summary text |
| type | string | No | Report type |

#### Example Request

```json
{
  "summary": "Annual checkup. Patient is in good health with no significant findings. Follow-up in 12 months."
}
```

#### Example Response

```json
{
  "message": "Report updated successfully",
  "data": {
    "id": "13",
    "patientName": "Jane Wilson",
    "patientId": "P011",
    "date": "2025-04-11T14:30:45.123Z",
    "summary": "Annual checkup. Patient is in good health with no significant findings. Follow-up in 12 months.",
    "type": "General",
    "createdAt": "2025-04-11T14:30:45.123Z",
    "updatedAt": "2025-04-11T14:40:22.456Z"
  }
}
```

### Delete Report

Deletes a report.

```
DELETE /reports/:id
```

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Report unique identifier |

#### Example Request

```
DELETE /reports/13
```

#### Example Response

Status code: 204 No Content (No response body)

## Error Examples

### Resource Not Found

```json
{
  "error": {
    "code": "REPORT_NOT_FOUND",
    "message": "Report with id 999 not found",
    "timestamp": "2025-04-11T14:35:22.123Z"
  }
}
```

### Validation Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Patient name is required and must be between 2 and 100 characters",
    "timestamp": "2025-04-11T14:36:10.456Z"
  }
}
```

### Invalid Parameter

```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Limit must be a number between 1 and 100",
    "timestamp": "2025-04-11T14:37:05.789Z"
  }
}
```