let userRole;

        async function fetchRole() {
            try {
                const response = await fetch('/api/me');
                const data = await response.json();
                return data.role;
            } catch (error) {
                console.error('Error fetching role:', error);
                return 0; // Default to guest on error
            }
        }

        async function loadSongs() {
            // Assuming GET /songs endpoint exists returning {songs: ['title1', 'title2', ...]}
            // If not, this would need server-side implementation
            try {
                const response = await fetch('/api/radio/get-queue?limit=9999');
                const data = await response.json();
                const songList = document.getElementById('song-list');
                songList.innerHTML = '';
                const allSongs = [...data.queues.queue, ...data.queues.defaultQueue];
                allSongs.forEach(({title}) => {
                    const card = document.createElement('div');
                    card.className = 'song-card';
                    card.innerHTML = `<h3>${title}</h3>`;
                    card.onclick = () => showSongInfo(title);

                    const actions = document.createElement('div');
                    actions.className = 'song-actions';

                    if (userRole >= 3) {
                        const enqueueBtn = document.createElement('button');
                        enqueueBtn.textContent = 'Enqueue';
                        enqueueBtn.onclick = (e) => { e.stopPropagation(); enqueueSong(title); };
                        actions.appendChild(enqueueBtn);
                    }

                    if (userRole >= 4) {
                        const deleteBtn = document.createElement('button');
                        deleteBtn.textContent = 'Delete';
                        deleteBtn.onclick = (e) => { e.stopPropagation(); deleteSong(title); };
                        actions.appendChild(deleteBtn);
                    }

                    card.appendChild(actions);
                    songList.appendChild(card);
                });
            } catch (error) {
                console.error('Error loading songs:', error);
                document.getElementById('song-list').innerHTML = '<p>Error loading songs. Please try again.</p>';
            }
        }

        function showSongInfo(title) {
            // Basic info display; extend with metadata if endpoint available
            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-info').textContent = `Details for "${title}". (Metadata like duration/artist not available via API.)`;
            document.getElementById('modal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('modal').style.display = 'none';
        }

        window.addTempSong = async function addTempSong() {
            const file = document.getElementById('temp-file').files[0];
            const name = document.getElementById('temp-name').value || file.name;
            if (!name || !file) return toastr.info('Name and file required.');

            const formData = new FormData();
            formData.append('name', name);
            formData.append('data', file);

            try {
                const response = await fetch('/api/radio/gateway/add-temp-song', { method: 'POST', body: formData });
                const data = await response.json();
                if (!data.error) {
                    toastr.info('Song added to one-time queue.');
                    loadSongs();
                } else {
                    toastr.error(data.errorText || 'Error adding song.');
                }
            } catch (error) {
                toastr.info('Unexpected error.');
            }
        }

        window.addPermSong = async function addPermSong() {
            const file = document.getElementById('perm-file').files[0];
            const name = document.getElementById('perm-name').value || file?.name;
            const enqueue = document.getElementById('enqueue-check').checked ? 1 : 0;
            if (!name || !file) return toastr.info('Name and file required.');

            const formData = new FormData();
            formData.append('name', name);
            formData.append('enqueue', enqueue);
            formData.append('data', file);

            try {
                const response = await fetch('/api/radio/gateway/add-song', { method: 'POST', body: formData });
                const data = await response.json();
                if (!data.error) {
                    toastr.info('Song added.');
                    loadSongs();
                } else {
                    toastr.info(data.errorText || 'Error adding song.');
                }
            } catch (error) {
                toastr.info('Unexpected error.');
            }
        }

        window.skipSong = async function skipSong() {
            try {
                const response = await fetch('/api/radio/gateway/skip-song');
                const data = await response.json();
                if (!data.error) {
                    toastr.info('Song skipped.');
                } else {
                    toastr.info(data.errorText || 'Error skipping song.');
                }
            } catch (error) {
                toastr.info('Unexpected error.');
            }
        }

        async function enqueueSong(title) {
            try {
                const response = await fetch(`/api/radio/gateway/enqueue?title=${encodeURIComponent(title)}`, { method: 'POST' });
                const data = await response.json();
                if (!data.error) {
                    toastr.info('Song enqueued.');
                } else {
                    toastr.info(data.errorText || 'Error enqueuing song.');
                }
            } catch (error) {
                toastr.info('Unexpected error.');
            }
        }

        async function deleteSong(title) {
            if (!confirm(`Delete "${title}"?`)) return;
            try {
                const response = await fetch(`/api/radio/gateway/delete-song?title=${encodeURIComponent(title)}`, { method: 'POST' });
                const data = await response.json();
                if (!data.error) {
                    toastr.info('Song deleted.');
                    loadSongs();
                } else {
                    toastr.info(data.errorText || 'Error deleting song.');
                }
            } catch (error) {
                toastr.info('Unexpected error.');
            }
        }

        async function initialize() {
            userRole = await fetchRole();
            document.getElementById('role-info').textContent = `Your Role: ${userRole}`;

            if (userRole < 2) {
                document.body.innerHTML = '<h1>Access Denied</h1><p>You must be at least Trusted to access this page.</p>';
                return;
            }

            loadSongs();

            if (userRole >= 2) document.getElementById('add-temp-form').style.display = 'block';
            if (userRole >= 3) document.getElementById('add-perm-form').style.display = 'block';
            if (userRole >= 4) document.getElementById('skip-section').style.display = 'block';
        }

        initialize();