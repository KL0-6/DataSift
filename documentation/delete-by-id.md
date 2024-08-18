# 🗑️ /delete-by-id

This endpoint allows users to delete a dataset from the database using its unique identifier. It validates the request parameters and token, then performs the deletion if the dataset exists and the token is valid.

## Overview 🌐

The `/delete-by-id` route provides functionality to remove a dataset from the MongoDB database. It ensures that the request parameters are valid, checks for the existence of the dataset, and performs the deletion. It then responds with a success message or an appropriate error.

## Request 📡

### HTTP Method

`DELETE`

### Request URL

`/delete-by-id`

### Query Parameters

#### Required Parameters 🔑

- **`defaultDatasetId`** (required): The unique identifier for the dataset you want to delete. This ID must match an existing dataset in the database.
- **`token`** (required): Authentication token to authorize the request. This token ensures that only authorized users can delete the dataset.

## Response Fields 📊

When the request is successful, the API returns this JSON object:
```json
{
  "message": "Dataset deleted successfully"
}
```

### Example Request

```bash
# That is an example defaultDatasetId value

curl -X DELETE 'http://yourdomain.com/delete-by-id' \
     --data-urlencode 'defaultDatasetId=dataset_77ca322a20b511fa33e1dde5cd85a74c501305768bc2c5cfb7ad66aa5b4ac238' \
     --data-urlencode 'token=your_auth_token'
```
