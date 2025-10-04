document.addEventListener('DOMContentLoaded', () => {
    const firebaseConfig = {
    };
    firebase.initializeApp(firebaseConfig); // MODIFIED: Initialize Firebase at the start
    const db = firebase.firestore();

    const mainContainer = document.querySelector('main');
    const authContainer = document.getElementById('auth-container');
    const allSections = document.querySelectorAll('.main-section');

    const showAuthScreen = () => {
        allSections.forEach(s => s.style.display = 'none');
        authContainer.style.display = 'flex';
        authContainer.innerHTML = `
            <div class="card auth-card">
                <h2>مرحباً!</h2>
                <p>ادحل المعرف المكون من 6 احرف او انشئ معرف جديد!</p>
                <input type="text" id="id-input" placeholder="ادخل المعرف" maxlength="6" style="text-transform: uppercase;">
                <div class="button-group">
                    <button id="enter-id-btn">اربط بالمعرف</button>
                    <button id="generate-id-btn">انشئ جديد</button>
                </div>
            </div>`;
        document.getElementById('enter-id-btn').onclick = () => {
            const inputId = document.getElementById('id-input').value.trim().toUpperCase();
            if (inputId.length === 6) {
                localStorage.setItem('eventAppUserId', inputId);
                location.reload();
            } else {
                alert('ادخل معرف مكون من 6 ارقام صحيح');
            }
        };
        document.getElementById('generate-id-btn').onclick = async () => { // MODIFIED: Made async
            const newId = Math.random().toString(36).substring(2, 8).toUpperCase();

            // NEW: Create the user document with a creation timestamp
            const userDocRef = db.collection('users').doc(newId);
            await userDocRef.set({
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            localStorage.setItem('eventAppUserId', newId);
            location.reload();
        };
    };

    const initializeApp = (userId) => { // MODIFIED: Renamed from showApp
        authContainer.style.display = 'none';
        if (window.innerWidth > 900) {
            allSections.forEach(s => s.style.display = 'flex');
        } else {
            document.querySelector('.main-section.active').style.display = 'flex';
        }

        // NEW: Update the last login timestamp for the current user
        const userDocRef = db.collection('users').doc(userId);
        userDocRef.set({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }); // Use merge:true to avoid overwriting createdAt

        const userInfoContainer = document.getElementById('user-info');
        userInfoContainer.innerHTML = `
            <span>المعرف الخاص بك : <b id="user-id">${userId}</b></span>
            <button id="switch-id-btn">تحويل معرف اخر</button>`;
        document.getElementById('switch-id-btn').onclick = () => {
            if (confirm('هل انت متأكد من تحويلك للمعرف؟ سنقوم بتسجيل الخروج')) {
                localStorage.removeItem('eventAppUserId');
                location.reload();
            }
        };

        // --- ALL OTHER APP LOGIC GOES BELOW ---

        // --- MOBILE TAB LOGIC ---
        const mobileTabs = document.getElementById('mobile-tabs');
        mobileTabs.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') return;
            const targetId = e.target.dataset.target;
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.main-section').forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none';
            });

            e.target.classList.add('active');
            const targetSection = document.querySelector(targetId);
            targetSection.classList.add('active');
            targetSection.style.display = 'flex';
        });

        // --- ACADEMIC EVENTS ---
        const academicEvents = [
            // الفصل الدراسي الأول 2025
            { title: "بداية فترة تأجيل الفصل الدراسي", date: "2025-08-17" },
            { title: "بداية الفصل الدراسي", date: "2025-08-24" },
            { title: "نهاية فترة تأجيل الفصل الدراسي", date: "2025-08-30" },
            { title: "بداية فترة الاعتذار عن مقرر أو فصل دراسي", date: "2025-09-07" },
            { title: "إجازة اليوم الوطني", date: "2025-09-23" },
            { title: "بداية إجازة الخريف", date: "2025-11-20" },
            { title: "استئناف الدراسة بعد إجازة الخريف", date: "2025-11-30" },
            { title: "نهاية فترة الاعتذار عن مقرر أو فصل دراسي", date: "2025-12-13" },
            { title: "بداية الاختبارات النهائية", date: "2025-12-21" },

            // الفصل الدراسي الثاني 2026
            { title: "بداية إجازة منتصف العام الدراسي", date: "2026-01-08" },
            { title: "بداية فترة تأجيل الفصل الدراسي", date: "2026-01-11" },
            { title: "بداية الفصل الدراسي", date: "2026-01-18" },
            { title: "نهاية فترة تأجيل الفصل الدراسي", date: "2026-01-24" },
            { title: "بداية فترة الاعتذار عن مقرر أو فصل دراسي", date: "2026-02-01" },
            { title: "إجازة يوم التأسيس", date: "2026-02-22" },
            { title: "بداية إجازة عيد الفطر", date: "2026-03-05" },
            { title: "استئناف الدراسة بعد الإجازة", date: "2026-03-29" },
            { title: "نهاية فترة الاعتذار عن مقرر أو فصل دراسي", date: "2026-05-16" },
            { title: "بداية إجازة عيد الأضحى", date: "2026-05-21" },
            { title: "استئناف الدراسة وبداية الاختبارات النهائية", date: "2026-06-02" },
            { title: "بداية إجازة نهاية العام الدراسي", date: "2026-06-18" },

            // الفصل الدراسي الصيفي 2026
            { title: "بداية الدراسة للفصل الدراسي الصيفي", date: "2026-06-28" },
            { title: "بداية فترة الاعتذار عن مقرر أو فصل دراسي", date: "2026-07-05" },
            { title: "نهاية فترة الاعتذار عن مقرر أو فصل دراسي", date: "2026-08-08" },
            { title: "بداية الاختبارات النهائية", date: "2026-08-16" },
            { title: "نهاية الفصل الدراسي الصيفي", date: "2026-08-20" }
        ];


        const eventsContainer = document.getElementById('events-container');
        const loadPreviousEventsBtn = document.getElementById('load-previous-events-btn');
        let pastEventsToLoad = [];
        const createEventCard = (event, status, days) => { const card = document.createElement('div'); card.classList.add('card', 'event-card', status); let countdownHTML = (status === 'previous') ? `<div class="countdown">${Math.abs(days)}</div><div class="label">ايام مضت</div>` : `<div class="countdown">${days}</div><div class="label">${days === 1 ? 'يوم متبقي' : 'ايام متبقية'}</div>`; card.innerHTML = `<div class="title">${event.title}</div>${countdownHTML}`; return card; };
        const renderAcademicEvents = () => { eventsContainer.innerHTML = ''; const today = new Date(); today.setHours(0, 0, 0, 0); const upcomingEvents = academicEvents.filter(e => new Date(e.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date)); const pastEvents = academicEvents.filter(e => new Date(e.date) < today).sort((a, b) => new Date(b.date) - new Date(a.date)); eventsContainer.innerHTML = ''; upcomingEvents.forEach((event, index) => { const diffDays = Math.ceil((new Date(event.date) - today) / (1000 * 60 * 60 * 24)); const status = index === 0 ? 'next-upcoming' : 'upcoming'; eventsContainer.appendChild(createEventCard(event, status, diffDays)); }); if (pastEvents.length > 0) { const mostRecentPast = pastEvents.shift(); const diffDays = Math.ceil((new Date(mostRecentPast.date) - today) / (1000 * 60 * 60 * 24)); eventsContainer.prepend(createEventCard(mostRecentPast, 'previous', diffDays)); } pastEventsToLoad = pastEvents; loadPreviousEventsBtn.disabled = pastEventsToLoad.length === 0; };
        loadPreviousEventsBtn.addEventListener('click', () => { const batch = pastEventsToLoad.splice(0, 5); const today = new Date(); today.setHours(0, 0, 0, 0); batch.forEach(event => { const diffDays = Math.ceil((new Date(event.date) - today) / (1000 * 60 * 60 * 24)); const card = createEventCard(event, 'previous', diffDays); eventsContainer.prepend(card); }); loadPreviousEventsBtn.disabled = pastEventsToLoad.length === 0; });
        renderAcademicEvents();

        // --- USER REMINDERS ---
        const remindersCollection = db.collection('users').doc(userId).collection('reminders');
        const reminderForm = document.getElementById('reminder-form');
        const remindersContainer = document.getElementById('reminders-container');
        const tagFiltersContainer = document.getElementById('tag-filters');
        const loadPreviousRemindersBtn = document.getElementById('load-previous-reminders-btn');
        let allReminders = [], pastRemindersToLoad = [], tagColorMap = {};
        let activeFilterTag = 'all';
        let tagColorPreferences = JSON.parse(localStorage.getItem('tagColorPreferences')) || {};
        const createReminderCard = (doc) => { const data = doc.data(); const card = document.createElement('div'); card.classList.add('card', 'reminder-card'); card.setAttribute('data-id', doc.id); card.style.borderLeft = `5px solid ${data.color || '#ccc'}`; const reminderDate = data.date.toDate(); const today = new Date(); today.setHours(0, 0, 0, 0); const diffDays = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24)); let countdownText = (diffDays < 0) ? `منذ ${Math.abs(diffDays)} ايام` : `بعد ${diffDays} ايام`; if (diffDays === 0) countdownText = 'اليوم'; if (diffDays < 0) card.classList.add('previous'); let timeString = data.hasTime ? reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''; const tagHTML = data.tag ? `<div class="tag" style="background-color:${data.color || '#6c757d'}">${data.tag}</div>` : ''; card.innerHTML = `<div class="reminder-card-header"><h3>${data.title}</h3>${tagHTML}</div><div><small>${reminderDate.toLocaleDateString()} ${timeString}</small><div class="countdown">${countdownText}</div></div><button class="delete-btn" title="Delete Reminder">🗑️</button>`; card.querySelector('.delete-btn').addEventListener('click', async () => { if (confirm('هل متأكد تريد حذف هذا التذكار؟')) { await remindersCollection.doc(doc.id).delete(); } }); return card; };
        const renderReminders = () => {
            const filtered = (activeFilterTag === 'all') ? allReminders : allReminders.filter(doc => doc.data().tag === activeFilterTag);
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const upcoming = filtered.filter(doc => doc.data().date.toDate() >= today).sort((a, b) => a.data().date.toDate() - b.data().date.toDate());
            const past = filtered.filter(doc => doc.data().date.toDate() < today).sort((a, b) => b.data().date.toDate() - a.data().date.toDate());
            remindersContainer.innerHTML = '';
            upcoming.forEach(doc => remindersContainer.appendChild(createReminderCard(doc)));
            if (past.length > 0) { remindersContainer.prepend(createReminderCard(past.shift())); }
            pastRemindersToLoad = past;
            loadPreviousRemindersBtn.disabled = pastRemindersToLoad.length === 0;
            if (upcoming.length === 0 && past.length === 0 && remindersContainer.innerHTML === '') { remindersContainer.innerHTML = '<p style="text-align:center; color:var(--secondary-text-color);">لايوجد تذكيرات حالياً قم بالاضافة!</p>'; }
        };
        const renderTagFilters = () => { const tags = ['all', ...new Set(allReminders.map(doc => doc.data().tag).filter(Boolean))]; tagFiltersContainer.innerHTML = ''; tags.forEach(tag => { const btn = document.createElement('button'); btn.classList.add('tag-btn'); if (tag === activeFilterTag) btn.classList.add('active'); btn.textContent = tag.charAt(0).toUpperCase() + tag.slice(1); btn.dataset.tag = tag; btn.addEventListener('click', () => { activeFilterTag = tag; renderReminders(); renderTagFilters(); }); tagFiltersContainer.appendChild(btn); }); };
        loadPreviousRemindersBtn.addEventListener('click', () => { const batch = pastRemindersToLoad.splice(0, 5); batch.forEach(doc => remindersContainer.prepend(createReminderCard(doc))); loadPreviousRemindersBtn.disabled = pastRemindersToLoad.length === 0; });
        remindersCollection.onSnapshot(async snapshot => {
            allReminders = snapshot.docs;
            tagColorMap = {};
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const allPastReminders = allReminders.filter(doc => doc.data().date.toDate() < today).sort((a, b) => b.data().date.toDate() - a.data().date.toDate());
            if (allPastReminders.length > 10) { const remindersToDelete = allPastReminders.slice(10); console.log(`Auto-deleting ${remindersToDelete.length} oldest reminder(s).`); const batch = db.batch(); remindersToDelete.forEach(doc => batch.delete(remindersCollection.doc(doc.id))); await batch.commit(); }
            allReminders.forEach(doc => { const data = doc.data(); if (data.tag && data.color) { tagColorMap[data.tag.toLowerCase()] = data.color; } });
            renderTagFilters(); renderReminders();
        });
        reminderForm.addEventListener('submit', async (e) => { e.preventDefault(); const title = document.getElementById('reminder-title').value; const dateVal = document.getElementById('reminder-date').value; const timeVal = document.getElementById('reminder-time').value; const includeTime = document.getElementById('include-time').checked; let finalDate; if (includeTime && timeVal) { finalDate = new Date(`${dateVal}T${timeVal}`); } else { finalDate = new Date(dateVal); finalDate.setHours(0, 0, 0, 0); } const tag = document.getElementById('reminder-tag').value.trim() || null; const color = document.getElementById('reminder-color').value; if (document.getElementById('always-use-checkbox')?.checked) { tagColorPreferences[tag.toLowerCase()] = color; localStorage.setItem('tagColorPreferences', JSON.stringify(tagColorPreferences)); } await remindersCollection.add({ title, date: firebase.firestore.Timestamp.fromDate(finalDate), hasTime: includeTime && !!timeVal, tag, color, createdAt: firebase.firestore.FieldValue.serverTimestamp() }); reminderForm.reset(); document.getElementById('reminder-time').style.display = 'none'; document.getElementById('tag-suggestion-box').style.display = 'none'; });
        document.getElementById('include-time').addEventListener('change', (e) => {  });
        const tagInput = document.getElementById('reminder-tag');
        const suggestionBox = document.getElementById('tag-suggestion-box');
        tagInput.addEventListener('input', (e) => {
            const currentTag = e.target.value.trim().toLowerCase();
            const colorPicker = document.getElementById('reminder-color');
            if (tagColorPreferences[currentTag]) { colorPicker.value = tagColorPreferences[currentTag]; suggestionBox.style.display = 'none'; return; }
            if (tagColorMap[currentTag]) { suggestionBox.innerHTML = `<div class="suggestion-content"><span>هل تريد استخدام لون تصنيف "${e.target.value}"؟ <span class="color-swatch" style="background-color: ${tagColorMap[currentTag]}"></span></span><div class="suggestion-actions"><button type="button" id="use-color-btn">استخدم</button><label><input type="checkbox" id="always-use-checkbox">دائماً</label></div></div>`; suggestionBox.style.display = 'block'; document.getElementById('use-color-btn').onclick = () => { colorPicker.value = tagColorMap[currentTag]; suggestionBox.style.display = 'none'; }; } else { suggestionBox.style.display = 'none'; }
        });

        // --- STANDALONE TO-DO LIST ---
        const todosCollection = db.collection('users').doc(userId).collection('todos');
        const todoForm = document.getElementById('todo-form');
        const todoContainer = document.getElementById('todo-container');
        const newTodoInput = document.getElementById('new-todo-input');
        const renderTodos = (snapshot) => { todoContainer.innerHTML = ''; if (snapshot.empty) { const li = document.createElement('li'); li.style.justifyContent = 'center'; li.style.color = 'var(--secondary-text-color)'; li.textContent = "لايوجد مهام حالياً قم بالاضافة!"; todoContainer.appendChild(li); return; } snapshot.docs.forEach(doc => { const data = doc.data(); const li = document.createElement('li'); li.dataset.id = doc.id; li.innerHTML = `<input type="checkbox" id="todo-${doc.id}" ${data.completed ? 'checked' : ''}><label for="todo-${doc.id}">${data.text}</label><button class="delete-btn">🗑️</button>`; li.querySelector('input[type="checkbox"]').addEventListener('change', (e) => { todosCollection.doc(doc.id).update({ completed: e.target.checked }); }); li.querySelector('.delete-btn').addEventListener('click', () => { todosCollection.doc(doc.id).delete(); }); todoContainer.appendChild(li); }); };
        todosCollection.orderBy('createdAt', 'desc').onSnapshot(renderTodos);
        todoForm.addEventListener('submit', async (e) => { e.preventDefault(); const text = newTodoInput.value.trim(); if (text) { await todosCollection.add({ text: text, completed: false, createdAt: firebase.firestore.FieldValue.serverTimestamp() }); newTodoInput.value = ''; } });
    };

    // --- INITIALIZE AUTH OR APP ---
    const userId = localStorage.getItem('eventAppUserId');
    if (!userId) {
        showAuthScreen();
    } else {
        initializeApp(userId);
    }
});