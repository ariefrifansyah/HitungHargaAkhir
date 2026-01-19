document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentForm');
    const studentTableBody = document.querySelector('#studentTable tbody');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const editIndexInput = document.getElementById('editIndex');

    let students = JSON.parse(localStorage.getItem('students')) || [];

    function saveStudents() {
        localStorage.setItem('students', JSON.stringify(students));
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
            deleteBtn.onclick = () => deleteStudent(index);
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

        editIndexInput.value = index;
        submitBtn.textContent = 'Update Student';
        cancelBtn.style.display = 'inline-block';
    };

    window.deleteStudent = (index) => {
        if (confirm('Are you sure you want to delete this student?')) {
            students.splice(index, 1);
            saveStudents();
            renderStudents();
            resetForm();
        }
    };

    function resetForm() {
        studentForm.reset();
        editIndexInput.value = '';
        submitBtn.textContent = 'Add Student';
        cancelBtn.style.display = 'none';
    }

    cancelBtn.addEventListener('click', resetForm);

    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const studentId = document.getElementById('studentId').value;
        const studentClass = document.getElementById('class').value;
        const grade = document.getElementById('grade').value;
        const editIndex = editIndexInput.value;

        const studentData = {
            name,
            studentId,
            class: studentClass,
            grade
        };

        if (editIndex === '') {
            // Create
            students.push(studentData);
        } else {
            // Update
            students[editIndex] = studentData;
        }

        saveStudents();
        renderStudents();
        resetForm();
    });

    renderStudents();
});
