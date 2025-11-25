# New Features Added

## 1. Reset Script

**Location:** `./reset.sh`

Delete all data and start fresh:

```bash
./reset.sh
```

This will:
- Delete all pastes from the database
- Remove site registration
- Require you to re-register

**Safety:** Asks for confirmation before deleting.

## 2. Edit Feature

You can now edit existing pastes directly from the web interface!

**How to use:**
1. Go to **Retrieve Data** tab
2. Click **Retrieve Data** to see all your pastes
3. Find the paste you want to edit
4. Click the **Edit** button
5. Modify the JSON data
6. Click **Save** to update
7. Or click **Cancel** to discard changes

**Features:**
- Live editing with validation
- Shows success message when saved
- Can't save invalid JSON
- Updates encrypted data with new epoch

## 3. Delete Feature

Delete unwanted pastes permanently:

**How to use:**
1. Go to **Retrieve Data** tab
2. Click **Retrieve Data** to see all your pastes
3. Find the paste you want to delete
4. Click the **Delete** button
5. Confirm the deletion
6. Paste is permanently removed

**Features:**
- Confirmation dialog prevents accidents
- Smooth fade-out animation
- Immediate removal from display
- Permanent deletion from database

## API Endpoints Added

### Update Paste
```
PUT /api/update
Body: { paste_id: number, data: object }
```

### Delete Paste
```
DELETE /api/delete/:paste_id
```

## Backend Changes

**Pastebin Service:**
- `PUT /update` - Update encrypted data
- `DELETE /delete` - Delete paste

**Website:**
- `PUT /api/update` - Update via pastebin client
- `DELETE /api/delete/:paste_id` - Delete via pastebin client

## Database

No schema changes needed! All features work with existing tables.

## Security

- Edit/Delete require authentication (handshake + epoch proof)
- Can only edit/delete pastes belonging to your site_id
- Updated data is re-encrypted with new epoch
- All operations verified by pastebin service

## Usage Example

### Store Data
```json
{
  "user": "john_doe",
  "email": "john@example.com",
  "settings": {
    "theme": "dark",
    "notifications": true
  }
}
```

### Edit Data
Click Edit, modify:
```json
{
  "user": "john_doe",
  "email": "john@example.com",
  "settings": {
    "theme": "light",
    "notifications": false
  }
}
```

### Delete Data
Click Delete, confirm → Gone forever!

## Testing the Features

1. **Restart your services** to apply changes:
   ```bash
   # Terminal 1
   cd pastebin
   npm start

   # Terminal 2
   cd website
   npm start
   ```

2. **Test Edit:**
   - Store some test data
   - Retrieve it
   - Click Edit
   - Change values
   - Click Save
   - Refresh to verify changes persisted

3. **Test Delete:**
   - Retrieve your data
   - Click Delete on a paste
   - Confirm deletion
   - Verify it's removed

4. **Test Reset:**
   ```bash
   ./reset.sh
   ```
   - Type "yes" to confirm
   - All data cleared
   - Re-register your site

Enjoy your enhanced encrypted pastebin! 🎉
