document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const terminalLoader = document.querySelector('.terminal-loader');
        terminalLoader.style.opacity = '0';
        
        setTimeout(() => {
            terminalLoader.style.display = 'none';
            document.querySelector('.main-container').classList.remove('hidden');
            document.querySelector('.main-container').classList.add('show');
            
            const bgAudio = document.getElementById('bgAudio');
            bgAudio.volume = 0.3;
            bgAudio.play().catch(e => console.log('Autoplay prevented:', e));
        }, 1000);
    }, 4000);

    const absensiForm = document.getElementById('absensiForm');
    absensiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value;
        const kelas = document.getElementById('kelas').value;
        
        const submitBtn = absensiForm.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="glitch" data-text="PROCESSING">PROCESSING</span><span class="tag">R2</span>';
        
        fetch('/absensi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `nama=${encodeURIComponent(nama)}&kelas=${encodeURIComponent(kelas)}`
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="glitch" data-text="SUBMIT">SUBMIT</span><span class="tag">R2</span>';
        });
    });

    const refreshLog = document.getElementById('refreshLog');
    refreshLog.addEventListener('click', function() {
        refreshLog.disabled = true;
        refreshLog.innerHTML = '<span class="glitch" data-text="REFRESHING">REFRESHING</span>';
        
        fetch('/get-absensi')
            .then(response => response.text())
            .then(data => {
                const logContent = document.getElementById('logContent');
                logContent.innerHTML = '';
                
                const entries = data.split('\n').filter(entry => entry.trim() !== '');
                
                if (entries.length === 0) {
                    logContent.innerHTML = '<p>NO LOG ENTRIES FOUND</p>';
                } else {
                    entries.reverse().forEach(entry => {
                        const [timestamp, nama, kelas] = entry.split(' | ');
                        const logEntry = document.createElement('div');
                        logEntry.className = 'log-entry';
                        logEntry.innerHTML = `
                            <span style="color: var(--neon-blue)">[${new Date(timestamp).toLocaleString()}]</span>
                            <span style="color: var(--neon-pink)">${nama}</span>
                            <span style="color: var(--neon-purple)">${kelas}</span>
                        `;
                        logContent.appendChild(logEntry);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('logContent').innerHTML = '<p>ERROR LOADING LOG</p>';
            })
            .finally(() => {
                refreshLog.disabled = false;
                refreshLog.innerHTML = '<span class="glitch" data-text="REFRESH">REFRESH</span>';
            });
    });

    if (new URLSearchParams(window.location.search).has('success')) {
        setTimeout(() => {
            refreshLog.click();
        }, 500);
    } else {
        refreshLog.click();
    }
});