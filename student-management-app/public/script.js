document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentForm');
    const studentTableBody = document.querySelector('#studentTable tbody');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const editIndexInput = document.getElementById('editIndex');

    let students = [];

    // Fetch students from API
    async function fetchStudents() {
        try {
            const response = await fetch('/api/students');
            const result = await response.json();
            if (result.message === 'success') {
                students = result.data;
                renderStudents();
            } else {
                console.error('Failed to fetch students:', result.error);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    function renderStudents() {
        studentTableBody.innerHTML = '';
        students.forEach((student, index) => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = student.name;
            row.appendChild(nameCell);

            const idCell = document.createElement('td');
            idCell.textContent = student.studentId;
            row.appendChild(idCell);

            const classCell = document.createElement('td');
            classCell.textContent = student.class;
            row.appendChild(classCell);

            const gradeCell = document.createElement('td');
            gradeCell.textContent = student.grade;
            row.appendChild(gradeCell);

            const actionCell = document.createElement('td');

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'action-btn edit-btn';
            editBtn.onclick = () => editStudent(index);
            actionCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.onclick = () => deleteStudent(student.id);
            actionCell.appendChild(deleteBtn);

            row.appendChild(actionCell);

            studentTableBody.appendChild(row);
        });
    }

    window.editStudent = (index) => {
        const student = students[index];
        document.getElementById('name').value = student.name;
        document.getElementById('studentId').value = student.studentId;
        document.getElementById('class').value = student.class;
        document.getElementById('grade').value = student.grade;

        editIndexInput.value = student.id; // Store database ID, not array index
        submitBtn.textContent = 'Update Student';
        cancelBtn.style.display = 'inline-block';
    };

    window.deleteStudent = async (id) => {
        if (confirm('Are you sure you want to delete this student?')) {
            try {
                const response = await fetch(`/api/students/${id}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                if (result.message === 'deleted') {
                    fetchStudents();
                    resetForm();
                } else {
                    alert('Failed to delete student: ' + result.error);
                }
            } catch (error) {
                console.error('Error deleting student:', error);
            }
        }
    };

    function resetForm() {
        studentForm.reset();
        editIndexInput.value = '';
        submitBtn.textContent = 'Add Student';
        cancelBtn.style.display = 'none';
    }

    cancelBtn.addEventListener('click', resetForm);

    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const studentId = document.getElementById('studentId').value;
        const studentClass = document.getElementById('class').value;
        const grade = document.getElementById('grade').value;
        const editId = editIndexInput.value;

        const studentData = {
            name,
            studentId,
            class: studentClass,
            grade
        };

        try {
            if (editId === '') {
                // Create
                const response = await fetch('/api/students', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(studentData)
                });
                const result = await response.json();
                if (result.message !== 'success') {
                     alert('Error adding student: ' + result.error);
                     return;
                }
            } else {
                // Update
                const response = await fetch(`/api/students/${editId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(studentData)
                });
                const result = await response.json();
                if (result.message !== 'success') {
                     alert('Error updating student: ' + result.error);
                     return;
                }
            }
            fetchStudents();
            resetForm();
        } catch (error) {
            console.error('Error saving student:', error);
            alert('An error occurred. Please try again.');
        }
    });

    // Initial load
    fetchStudents();
});
