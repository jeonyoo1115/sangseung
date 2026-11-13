document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const assigneeGroupsContainer = document.getElementById('assignee-groups');
    const completedList = document.getElementById('completed-list');

    let tasks = [];

    // 폼 제출 (할 일 추가) 이벤트
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const desc = document.getElementById('task-desc').value;
        const date = document.getElementById('task-date').value;
        const assignee = document.getElementById('task-assignee').value;
        
        const newTask = {
            id: Date.now().toString(),
            desc,
            date,
            assignee,
            completed: false
        };
        
        tasks.push(newTask);
        taskForm.reset();
        
        // 추가 후 드롭다운은 기본값으로 초기화
        document.getElementById('task-assignee').value = '미배정';
        
        renderTasks();
    });

    // 상태(완료/미완료) 토글
    function toggleTaskStatus(id) {
        const task = tasks.find(t => t.id === id);
        if(task) {
            task.completed = !task.completed;
            renderTasks();
        }
    }

    // 영구 삭제
    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }

    // 화면 렌더링 함수
    function renderTasks() {
        assigneeGroupsContainer.innerHTML = '';
        completedList.innerHTML = '';

        const pendingTasks = tasks.filter(t => !t.completed);
        const completedTasks = tasks.filter(t => t.completed);

        // 진행 중인 일 배치
        if (pendingTasks.length === 0) {
            assigneeGroupsContainer.innerHTML = '<div class="empty-state">할 일을 추가해주세요!</div>';
        } else {
            const groups = pendingTasks.reduce((acc, task) => {
                if (!acc[task.assignee]) acc[task.assignee] = [];
                acc[task.assignee].push(task);
                return acc;
            }, {});

            for (const assignee in groups) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'assignee-group';
                
                const groupTitle = document.createElement('h3');
                groupTitle.textContent = assignee;
                groupDiv.appendChild(groupTitle);

                const ul = document.createElement('ul');
                ul.className = 'task-list';

                groups[assignee].forEach(task => {
                    const li = document.createElement('li');
                    li.className = 'task-item';
                    
                    li.innerHTML = `
                        <div class="task-content">
                            <input type="checkbox" onchange="window.toggleTaskStatus('${task.id}')">
                            <div class="task-details">
                                <span class="task-desc">${task.desc}</span>
                                <span class="task-meta">마감일: ${task.date}</span>
                            </div>
                        </div>
                    `;
                    ul.appendChild(li);
                });

                groupDiv.appendChild(ul);
                assigneeGroupsContainer.appendChild(groupDiv);
            }
        }

        // 공통 완료한 일 배치
        if (completedTasks.length === 0) {
            completedList.innerHTML = '<div class="empty-state">완료된 일이 없습니다.</div>';
        } else {
            completedTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = 'task-item';
                
                li.innerHTML = `
                    <div class="task-content">
                        <input type="checkbox" checked onchange="window.toggleTaskStatus('${task.id}')">
                        <div class="task-details">
                            <span class="task-desc" style="text-decoration: line-through; color: #999;">${task.desc}</span>
                            <span class="task-meta">담당: ${task.assignee} | 마감일: ${task.date}</span>
                        </div>
                    </div>
                    <button class="delete-btn" onclick="window.deleteTask('${task.id}')">제거</button>
                `;
                completedList.appendChild(li);
            });
        }
    }

    // HTML에서 호출할 수 있도록 전역으로 설정
    window.toggleTaskStatus = toggleTaskStatus;
    window.deleteTask = deleteTask;
});
