const apiUrl = 'http://localhost:8000/api/students';

document.addEventListener('DOMContentLoaded', () => {
    fetchStudents();

    const form = document.getElementById('studentForm');
    const cancelBtn = document.getElementById('cancelBtn');

    form.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
});

function fetchStudents() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(json => {
            if(json.message === "success") {
                displayStudents(json.data);
            }
        })
        .catch(error => console.error('Error fetching students:', error));
}

function displayStudents(students) {
    const tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = '';

    students.forEach(student => {
        const tr = document.createElement('tr');

        const createCell = (text) => {
            const td = document.createElement('td');
            td.textContent = text;
            return td;
        };

        tr.appendChild(createCell(student.nim));
        tr.appendChild(createCell(student.name));
        tr.appendChild(createCell(student.major));
        tr.appendChild(createCell(student.year));

        const actionTd = document.createElement('td');

        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editStudent(student.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.textContent = 'Hapus';
        deleteBtn.onclick = () => deleteStudent(student.id);

        actionTd.appendChild(editBtn);
        actionTd.appendChild(deleteBtn);
        tr.appendChild(actionTd);

        tbody.appendChild(tr);
    });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('studentId').value;
    const nim = document.getElementById('nim').value;
    const name = document.getElementById('name').value;
    const major = document.getElementById('major').value;
    const year = document.getElementById('year').value;

    const data = { nim, name, major, year };

    if (id) {
        // Update
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(json => {
            if(json.message === "success") {
                fetchStudents();
                resetForm();
            }
        });
    } else {
        // Create
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(json => {
            if(json.message === "success") {
                fetchStudents();
                resetForm();
            } else {
                alert('Error: ' + (json.error || 'Unknown error'));
            }
        });
    }
}

function editStudent(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(json => {
            if(json.message === "success") {
                const student = json.data;
                document.getElementById('studentId').value = student.id;
                document.getElementById('nim').value = student.nim;
                document.getElementById('name').value = student.name;
                document.getElementById('major').value = student.major;
                document.getElementById('year').value = student.year;

                document.getElementById('submitBtn').textContent = 'Update Mahasiswa';
                document.getElementById('cancelBtn').style.display = 'inline-block';
            }
        });
}

function deleteStudent(id) {
    if(confirm('Are you sure you want to delete this student?')) {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(json => {
            if(json.message === "deleted") {
                fetchStudents();
            }
        });
    }
}

function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('submitBtn').textContent = 'Tambah Mahasiswa';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Expose functions to global scope for onclick handlers
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
