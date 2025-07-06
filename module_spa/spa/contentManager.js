const ContentManager = (function() {
  const sampleData = {
    posts: [
      {
        id: 1,
        title: "First Article",
        content: "This is the content of the first sample article.",
        author: "John Doe",
        date: "2024-01-15"
      }
    ],
    products: [
      {
        id: 1,
        name: "Product A",
        description: "Description of product A with important features.",
        price: 29.99,
        category: "Electronics"
      }
    ]
  };

  const formConfigs = {
    posts: {
      title: 'Add New Article',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'content', label: 'Content', type: 'textarea', required: true },
        { name: 'author', label: 'Author', type: 'text', required: true },
        { name: 'date', label: 'Date', type: 'date', required: true }
      ]
    },
    products: {
      title: 'Add New Product',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'price', label: 'Price', type: 'number', required: true },
        { name: 'category', label: 'Category', type: 'text', required: true }
      ]
    }
  };

  function init() {
    if (!localStorage.getItem('posts')) {
      localStorage.setItem('posts', JSON.stringify(sampleData.posts));
    }
    if (!localStorage.getItem('products')) {
      localStorage.setItem('products', JSON.stringify(sampleData.products));
    }
  }

  function createContentItem(item, contentType) {
    if (contentType === 'posts') {
      return `
        <div class="content-item">
          <h3>${item.title}</h3>
          <p><strong>Author:</strong> ${item.author}</p>
          <p><strong>Date:</strong> ${item.date}</p>
          <p>${item.content}</p>
          <div class="actions">
            <button class="edit-btn" data-id="${item.id}">Edit</button>
            <button class="delete-btn" data-id="${item.id}">Delete</button>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="content-item">
          <h3>${item.name}</h3>
          <p><strong>Category:</strong> ${item.category}</p>
          <p><strong>Price:</strong> $${item.price}</p>
          <p>${item.description}</p>
          <div class="actions">
            <button class="edit-btn" data-id="${item.id}">Edit</button>
            <button class="delete-btn" data-id="${item.id}">Delete</button>
          </div>
        </div>
      `;
    }
  }

  function generateForm(formContainerId, formTitleId, contentType, editingId = null) {
    const formContainer = document.getElementById(formContainerId);
    const formTitle = document.getElementById(formTitleId);
    
    if (!formContainer || !formTitle) return;
    
    const config = formConfigs[contentType];
    
    formTitle.textContent = editingId ? 
      `Edit ${contentType === 'posts' ? 'Article' : 'Product'}` : 
      config.title;
    
    formContainer.innerHTML = config.fields.map(field => {
      const inputType = field.type === 'textarea' ? 
        `<textarea name="${field.name}" ${field.required ? 'required' : ''}></textarea>` :
        `<input type="${field.type}" name="${field.name}" ${field.required ? 'required' : ''}>`;
      
      return `
        <div class="form-group">
          <label for="${field.name}">${field.label}:</label>
          ${inputType}
        </div>
      `;
    }).join('') + `
      <button type="submit" class="submit-btn">
        ${editingId ? 'Update' : 'Add'} ${contentType === 'posts' ? 'Article' : 'Product'}
      </button>
      ${editingId ? '<button type="button" class="edit-btn cancel-edit-btn">Cancel</button>' : ''}
    `;
  }

  function fillFormForEdit(formContainerId, contentType, itemId) {
    const data = JSON.parse(localStorage.getItem(contentType) || '[]');
    const item = data.find(i => i.id === itemId);
    
    if (item) {
      const form = document.getElementById(formContainerId);
      if (!form) return;
      
      Object.keys(item).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input && key !== 'id') {
          input.value = item[key];
        }
      });
    }
  }

  function handleFormSubmit(e, contentType, onSuccess) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = JSON.parse(localStorage.getItem(contentType) || '[]');
    
    const newItem = {};
    formData.forEach((value, key) => {
      newItem[key] = value;
    });
    
    const editingId = e.target.closest('form').querySelector('.cancel-edit-btn')?.dataset.id;
    
    if (editingId) {
      const index = data.findIndex(item => item.id === parseInt(editingId));
      if (index !== -1) {
        newItem.id = parseInt(editingId);
        data[index] = newItem;
      }
    } else {
      newItem.id = Date.now();
      data.push(newItem);
    }
    
    localStorage.setItem(contentType, JSON.stringify(data));
    e.target.reset();
    
    if (onSuccess) onSuccess();
  }

  return {
    init,
    createContentItem,
    generateForm,
    fillFormForEdit,
    handleFormSubmit,
    get formConfigs() { return formConfigs; },
    get sampleData() { return sampleData; }
  };
})();

document.addEventListener('DOMContentLoaded', ContentManager.init);