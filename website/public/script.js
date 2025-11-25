// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');

    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update active tab pane
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
  });
});

// Store data form
document.getElementById('storeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const location = document.getElementById('storeLocation').value;
  const dataText = document.getElementById('storeData').value;
  const resultDiv = document.getElementById('storeResult');

  try {
    // Validate JSON
    const data = JSON.parse(dataText);

    // Show loading
    resultDiv.className = 'result show';
    resultDiv.innerHTML = '<p>Storing data...</p>';

    const response = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, data })
    });

    const result = await response.json();

    if (response.ok) {
      resultDiv.className = 'result show success';
      resultDiv.innerHTML = `
        <h3>Success!</h3>
        <p>Data stored successfully</p>
        <pre>${JSON.stringify(result, null, 2)}</pre>
      `;
      document.getElementById('storeForm').reset();
    } else {
      throw new Error(result.message || 'Store failed');
    }
  } catch (error) {
    resultDiv.className = 'result show error';
    resultDiv.innerHTML = `
      <h3>Error</h3>
      <p>${error.message}</p>
    `;
  }
});

// Retrieve data form
document.getElementById('retrieveForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const location = document.getElementById('retrieveLocation').value;
  const resultDiv = document.getElementById('retrieveResult');

  try {
    // Show loading
    resultDiv.className = 'result show';
    resultDiv.innerHTML = '<p>Retrieving data...</p>';

    const url = location
      ? `/api/retrieve?location=${encodeURIComponent(location)}`
      : '/api/retrieve';

    const response = await fetch(url);
    const result = await response.json();

    if (response.ok) {
      if (result.data && result.data.length > 0) {
        let html = '<h3>Retrieved Data</h3>';
        result.data.forEach(item => {
          html += `
            <div class="data-item" id="item-${item.id}">
              <h4>ID: ${item.id}</h4>
              <div class="meta">
                Location: ${item.location}<br>
                Created: ${new Date(item.created_at).toLocaleString()}<br>
                Epoch: ${item.epoch}
              </div>
              <pre class="data-content">${JSON.stringify(item.data, null, 2)}</pre>
              <div class="actions">
                <button class="btn-small btn-edit" onclick="editPaste(${item.id})">Edit</button>
                <button class="btn-small btn-delete" onclick="deletePaste(${item.id})">Delete</button>
              </div>
            </div>
          `;
        });
        resultDiv.className = 'result show success';
        resultDiv.innerHTML = html;
      } else {
        resultDiv.className = 'result show';
        resultDiv.innerHTML = '<p>No data found</p>';
      }
    } else {
      throw new Error(result.message || 'Retrieve failed');
    }
  } catch (error) {
    resultDiv.className = 'result show error';
    resultDiv.innerHTML = `
      <h3>Error</h3>
      <p>${error.message}</p>
    `;
  }
});

// Register site
document.getElementById('registerBtn').addEventListener('click', async () => {
  const resultDiv = document.getElementById('registerResult');

  try {
    // Show loading
    resultDiv.className = 'result show';
    resultDiv.innerHTML = '<p>Registering site...</p>';

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();

    if (response.ok) {
      resultDiv.className = 'result show success';
      resultDiv.innerHTML = `
        <h3>Success!</h3>
        <p>Site registered successfully</p>
        <pre>${JSON.stringify(result, null, 2)}</pre>
      `;
    } else {
      throw new Error(result.message || 'Registration failed');
    }
  } catch (error) {
    resultDiv.className = 'result show error';
    resultDiv.innerHTML = `
      <h3>Error</h3>
      <p>${error.message}</p>
    `;
  }
});

// Test handshake
document.getElementById('testBtn').addEventListener('click', async () => {
  const resultDiv = document.getElementById('testResult');

  try {
    // Show loading
    resultDiv.className = 'result show';
    resultDiv.innerHTML = '<p>Testing handshake...</p>';

    const response = await fetch('/api/test-handshake');
    const result = await response.json();

    if (response.ok) {
      resultDiv.className = 'result show success';
      resultDiv.innerHTML = `
        <h3>Success!</h3>
        <p>${result.message}</p>
        <p>Connection to pastebin service is working correctly.</p>
      `;
    } else {
      throw new Error(result.message || 'Handshake failed');
    }
  } catch (error) {
    resultDiv.className = 'result show error';
    resultDiv.innerHTML = `
      <h3>Error</h3>
      <p>${error.message}</p>
      <p>Make sure the pastebin service is running and configured correctly.</p>
    `;
  }
});

// Edit paste function
async function editPaste(pasteId) {
  const itemDiv = document.getElementById(`item-${pasteId}`);
  const dataContent = itemDiv.querySelector('.data-content');
  const actionsDiv = itemDiv.querySelector('.actions');

  // Get current data
  const currentData = dataContent.textContent;

  // Replace content with edit form
  dataContent.style.display = 'none';
  actionsDiv.style.display = 'none';

  const editForm = document.createElement('div');
  editForm.className = 'edit-form';
  editForm.innerHTML = `
    <textarea id="edit-data-${pasteId}">${currentData}</textarea>
    <div class="actions">
      <button class="btn-small btn-save" onclick="savePaste(${pasteId})">Save</button>
      <button class="btn-small btn-cancel" onclick="cancelEdit(${pasteId})">Cancel</button>
    </div>
  `;

  itemDiv.appendChild(editForm);
}

// Save edited paste
async function savePaste(pasteId) {
  const textarea = document.getElementById(`edit-data-${pasteId}`);
  const newDataText = textarea.value;

  try {
    // Parse JSON to validate
    const newData = JSON.parse(newDataText);

    // Show loading
    textarea.disabled = true;
    textarea.value = 'Saving...';

    const response = await fetch('/api/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paste_id: pasteId,
        data: newData
      })
    });

    const result = await response.json();

    if (response.ok) {
      // Refresh the item
      const itemDiv = document.getElementById(`item-${pasteId}`);
      const dataContent = itemDiv.querySelector('.data-content');
      const actionsDiv = itemDiv.querySelector('.actions');
      const editForm = itemDiv.querySelector('.edit-form');

      dataContent.textContent = JSON.stringify(newData, null, 2);
      dataContent.style.display = 'block';
      actionsDiv.style.display = 'flex';
      editForm.remove();

      // Show success message briefly
      const successMsg = document.createElement('div');
      successMsg.className = 'meta';
      successMsg.style.color = '#4CAF50';
      successMsg.textContent = '✓ Saved successfully';
      itemDiv.insertBefore(successMsg, dataContent);
      setTimeout(() => successMsg.remove(), 3000);
    } else {
      throw new Error(result.message || 'Update failed');
    }
  } catch (error) {
    alert('Error: ' + error.message);
    textarea.disabled = false;
    textarea.value = newDataText;
  }
}

// Cancel edit
function cancelEdit(pasteId) {
  const itemDiv = document.getElementById(`item-${pasteId}`);
  const dataContent = itemDiv.querySelector('.data-content');
  const actionsDiv = itemDiv.querySelector('.actions');
  const editForm = itemDiv.querySelector('.edit-form');

  dataContent.style.display = 'block';
  actionsDiv.style.display = 'flex';
  editForm.remove();
}

// Delete paste function
async function deletePaste(pasteId) {
  if (!confirm('Are you sure you want to delete this paste? This cannot be undone.')) {
    return;
  }

  try {
    const itemDiv = document.getElementById(`item-${pasteId}`);
    itemDiv.style.opacity = '0.5';

    const response = await fetch(`/api/delete/${pasteId}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (response.ok) {
      // Fade out and remove
      itemDiv.style.transition = 'opacity 0.3s ease';
      itemDiv.style.opacity = '0';
      setTimeout(() => {
        itemDiv.remove();

        // Check if no items left
        const retrieveResult = document.getElementById('retrieveResult');
        if (!retrieveResult.querySelector('.data-item')) {
          retrieveResult.innerHTML = '<p>No data found</p>';
        }
      }, 300);
    } else {
      throw new Error(result.message || 'Delete failed');
    }
  } catch (error) {
    alert('Error: ' + error.message);
    document.getElementById(`item-${pasteId}`).style.opacity = '1';
  }
}
