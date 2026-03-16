// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.tournament = window.tournament;
        this.html5QrCode = null;
        this.recentScans = [];
        this.initializeEventListeners();
        this.updateDashboard();
        this.initializeQRScanner();
    }

    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.admin-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.showSection(targetId);
                
                // Update active nav
                document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Forms
        document.getElementById('addPartnerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddPartner(e);
        });

        // Filters
        document.getElementById('teamSportFilter')?.addEventListener('change', () => this.updateTeamsTable());
        document.getElementById('teamSearch')?.addEventListener('input', () => this.updateTeamsTable());
        document.getElementById('volunteerMissionFilter')?.addEventListener('change', () => this.updateVolunteersTable());
        document.getElementById('volunteerAvailabilityFilter')?.addEventListener('change', () => this.updateVolunteersTable());
        document.getElementById('matchSportFilter')?.addEventListener('change', () => this.updateMatchesTable());
        document.getElementById('matchStatusFilter')?.addEventListener('change', () => this.updateMatchesTable());

        // Match selector for scoring
        document.getElementById('matchToScore')?.addEventListener('change', (e) => {
            this.showScoreInput(e.target.value);
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    showSection(sectionId) {
        document.querySelectorAll('.admin-section').forEach(section => {
            section.style.display = 'none';
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }

    updateDashboard() {
        const stats = this.tournament.getStats();
        
        document.getElementById('totalTeams').textContent = stats.totalTeams;
        document.getElementById('totalVolunteers').textContent = stats.totalVolunteers;
        document.getElementById('totalMatches').textContent = stats.totalMatches;
        document.getElementById('sportsCount').textContent = stats.sportsCount;

        this.updateSportsTable();
        this.updateTeamsTable();
        this.updateVolunteersTable();
        this.updateMatchesTable();
        this.updatePartnersTable();
        this.updateFilters();
        this.updateMatchSelector();
        this.updateMissionAssignments();
    }

    updateSportsTable() {
        const tbody = document.getElementById('sportsTable');
        if (!tbody) return;

        tbody.innerHTML = this.tournament.sports.map(sport => {
            const registeredCount = this.tournament.teams.filter(t => t.sport === sport.id).length;
            return `
                <tr>
                    <td><i class="${sport.icon}"></i> ${sport.name}</td>
                    <td>${sport.maxTeams}</td>
                    <td>${sport.teamSize}</td>
                    <td>${sport.poolCount}</td>
                    <td>${registeredCount}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="admin.editSport('${sport.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="admin.deleteSport('${sport.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    updateTeamsTable() {
        const tbody = document.getElementById('teamsTable');
        if (!tbody) return;

        const sportFilter = document.getElementById('teamSportFilter')?.value || 'all';
        const searchTerm = document.getElementById('teamSearch')?.value.toLowerCase() || '';

        let filteredTeams = this.tournament.teams;

        if (sportFilter !== 'all') {
            filteredTeams = filteredTeams.filter(team => team.sport === sportFilter);
        }

        if (searchTerm) {
            filteredTeams = filteredTeams.filter(team => 
                team.name.toLowerCase().includes(searchTerm) ||
                team.captain.toLowerCase().includes(searchTerm)
            );
        }

        tbody.innerHTML = filteredTeams.map(team => {
            const sport = this.tournament.sports.find(s => s.id === team.sport);
            return `
                <tr>
                    <td><strong>${team.name}</strong></td>
                    <td>${sport?.name || team.sport}</td>
                    <td>${team.captain}</td>
                    <td>${team.email}</td>
                    <td>${team.playerCount}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="admin.showQRCode('${team.id}')">
                            <i class="fas fa-qrcode"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="admin.editTeam('${team.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="admin.deleteTeam('${team.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    updateVolunteersTable() {
        const tbody = document.getElementById('volunteersTable');
        if (!tbody) return;

        const missionFilter = document.getElementById('volunteerMissionFilter')?.value || 'all';
        const availabilityFilter = document.getElementById('volunteerAvailabilityFilter')?.value || 'all';

        let filteredVolunteers = this.tournament.volunteers;

        if (missionFilter !== 'all') {
            filteredVolunteers = filteredVolunteers.filter(v => v.mission === missionFilter);
        }

        if (availabilityFilter !== 'all') {
            filteredVolunteers = filteredVolunteers.filter(v => v.availability === availabilityFilter);
        }

        tbody.innerHTML = filteredVolunteers.map(volunteer => `
            <tr>
                <td>${volunteer.name}</td>
                <td>${volunteer.email}</td>
                <td>${volunteer.phone}</td>
                <td>${this.getAvailabilityLabel(volunteer.availability)}</td>
                <td>${this.getMissionLabel(volunteer.mission)}</td>
                <td>
                    <span class="badge ${volunteer.assigned ? 'badge-success' : 'badge-warning'}">
                        ${volunteer.assigned ? 'Assigné' : 'Non assigné'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="admin.assignVolunteer('${volunteer.id}')">
                        <i class="fas fa-user-check"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="admin.deleteVolunteer('${volunteer.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    updateMatchesTable() {
        const tbody = document.getElementById('matchesTable');
        if (!tbody) return;

        const sportFilter = document.getElementById('matchSportFilter')?.value || 'all';
        const statusFilter = document.getElementById('matchStatusFilter')?.value || 'all';

        let filteredMatches = this.tournament.matches;

        if (sportFilter !== 'all') {
            filteredMatches = filteredMatches.filter(m => m.sportId === sportFilter);
        }

        if (statusFilter !== 'all') {
            filteredMatches = filteredMatches.filter(m => m.status === statusFilter);
        }

        tbody.innerHTML = filteredMatches.map(match => {
            const sport = this.tournament.sports.find(s => s.id === match.sportId);
            return `
                <tr>
                    <td>${match.id}</td>
                    <td>${sport?.name || match.sportId}</td>
                    <td>${match.team1.name}</td>
                    <td>${match.team2.name}</td>
                    <td>
                        ${match.score1 !== null ? `${match.score1} - ${match.score2}` : '-'}
                    </td>
                    <td>${match.time}</td>
                    <td>${match.terrain}</td>
                    <td>
                        <span class="badge badge-${match.status === 'completed' ? 'success' : 'warning'}">
                            ${match.status === 'completed' ? 'Terminé' : 'En attente'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="admin.editMatch('${match.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    updatePartnersTable() {
        const tbody = document.getElementById('partnersTable');
        if (!tbody) return;

        tbody.innerHTML = this.tournament.partners.map(partner => `
            <tr>
                <td><strong>${partner.name}</strong></td>
                <td>${partner.level}</td>
                <td>${partner.description}</td>
                <td>
                    ${partner.website ? `<a href="${partner.website}" target="_blank">Visiter</a>` : '-'}
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="admin.editPartner('${partner.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="admin.deletePartner('${partner.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    updateFilters() {
        // Update sport filters
        const sportOptions = '<option value="all">Tous les sports</option>' +
            this.tournament.sports.map(sport => 
                `<option value="${sport.id}">${sport.name}</option>`
            ).join('');

        document.getElementById('teamSportFilter').innerHTML = sportOptions;
        document.getElementById('matchSportFilter').innerHTML = sportOptions;

        // Update mission filter
        const missions = ['accueil', 'arbitrage', 'restauration', 'logistique', 'terrains', 'ecran'];
        const missionOptions = '<option value="all">Toutes les missions</option>' +
            missions.map(mission => 
                `<option value="${mission}">${this.getMissionLabel(mission)}</option>`
            ).join('');

        document.getElementById('volunteerMissionFilter').innerHTML = missionOptions;

        // Update availability filter
        const availabilities = ['matin', 'apres-midi', 'soiree', 'journee'];
        const availabilityOptions = '<option value="all">Toutes les disponibilités</option>' +
            availabilities.map(availability => 
                `<option value="${availability}">${this.getAvailabilityLabel(availability)}</option>`
            ).join('');

        document.getElementById('volunteerAvailabilityFilter').innerHTML = availabilityOptions;
    }

    updateMatchSelector() {
        const selector = document.getElementById('matchToScore');
        if (!selector) return;

        const pendingMatches = this.tournament.matches.filter(m => m.status === 'pending');
        
        selector.innerHTML = '<option value="">Sélectionner un match</option>' +
            pendingMatches.map(match => {
                const sport = this.tournament.sports.find(s => s.id === match.sportId);
                return `<option value="${match.id}">
                    ${sport?.name || match.sportId} - ${match.team1.name} vs ${match.team2.name} (${match.time})
                </option>`;
            }).join('');
    }

    updateMissionAssignments() {
        const container = document.getElementById('missionAssignments');
        if (!container) return;

        const missions = ['accueil', 'arbitrage', 'restauration', 'logistique', 'terrains', 'ecran'];
        
        container.innerHTML = missions.map(mission => {
            const assigned = this.tournament.volunteers.filter(v => v.mission === mission && v.assigned).length;
            const needed = this.getNeededVolunteers(mission);
            const percentage = needed > 0 ? (assigned / needed) * 100 : 0;
            
            return `
                <div class="mission-assignment">
                    <h4>${this.getMissionLabel(mission)}</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <p>${assigned} / ${needed} bénévoles assignés</p>
                </div>
            `;
        }).join('');
    }

    getNeededVolunteers(mission) {
        const needs = {
            'accueil': 4,
            'arbitrage': 8,
            'restauration': 6,
            'logistique': 4,
            'terrains': 6,
            'ecran': 2
        };
        return needs[mission] || 2;
    }

    getMissionLabel(mission) {
        const labels = {
            'accueil': 'Accueil des équipes',
            'arbitrage': 'Arbitrage',
            'restauration': 'Restauration',
            'logistique': 'Logistique',
            'terrains': 'Gestion des terrains',
            'ecran': 'Gestion écran/résultats'
        };
        return labels[mission] || mission;
    }

    getAvailabilityLabel(availability) {
        const labels = {
            'matin': 'Matin uniquement',
            'apres-midi': 'Après-midi uniquement',
            'soiree': 'Soirée uniquement',
            'journee': 'Toute la journée'
        };
        return labels[availability] || availability;
    }

    showScoreInput(matchId) {
        const scoreInput = document.getElementById('scoreInput');
        if (!matchId) {
            scoreInput.style.display = 'none';
            return;
        }

        const match = this.tournament.matches.find(m => m.id === matchId);
        if (!match) return;

        document.getElementById('team1Name').textContent = match.team1.name;
        document.getElementById('team2Name').textContent = match.team2.name;
        document.getElementById('score1').value = match.score1 || 0;
        document.getElementById('score2').value = match.score2 || 0;

        scoreInput.style.display = 'block';
        scoreInput.dataset.matchId = matchId;
    }

    // QR Scanner
    initializeQRScanner() {
        // This will be initialized when the user clicks the scan button
    }

    async startQRScanner() {
        if (this.html5QrCode) {
            await this.html5QrCode.stop();
        }

        this.html5QrCode = new Html5Qrcode("qr-reader");
        
        try {
            await this.html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText, decodedResult) => {
                    this.handleQRScan(decodedText);
                },
                (errorMessage) => {
                    // Handle scan error silently
                }
            );
        } catch (err) {
            console.error('QR Scanner error:', err);
            this.showMessage('Impossible d\'accéder à la caméra', 'error');
        }
    }

    handleQRScan(decodedText) {
        const team = this.tournament.scanQRCode(decodedText);
        if (team) {
            this.addRecentScan(team);
            this.showScanResult(team, true);
        } else {
            this.showScanResult(null, false);
        }
    }

    addRecentScan(team) {
        this.recentScans.unshift({
            team: team,
            timestamp: new Date()
        });
        
        // Keep only last 10 scans
        this.recentScans = this.recentScans.slice(0, 10);
        
        this.updateRecentScans();
    }

    updateRecentScans() {
        const container = document.getElementById('recentScans');
        if (!container) return;

        container.innerHTML = this.recentScans.map(scan => `
            <div class="recent-scan">
                <strong>${scan.team.name}</strong>
                <small>${new Date(scan.timestamp).toLocaleTimeString()}</small>
            </div>
        `).join('');
    }

    showScanResult(team, success) {
        const resultDiv = document.getElementById('scanResult');
        if (!resultDiv) return;

        if (success && team) {
            resultDiv.innerHTML = `
                <div class="scan-success">
                    <i class="fas fa-check-circle"></i>
                    <h3>Équipe trouvée!</h3>
                    <p><strong>${team.name}</strong></p>
                    <p>${team.captain} - ${team.sport}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="scan-error">
                    <i class="fas fa-times-circle"></i>
                    <h3>QR Code non reconnu</h3>
                    <p>Veuillez réessayer</p>
                </div>
            `;
        }

        // Clear result after 3 seconds
        setTimeout(() => {
            resultDiv.innerHTML = '';
        }, 3000);
    }

    // Partner Management
    handleAddPartner(e) {
        const formData = new FormData(e.target);
        const partnerData = {
            id: this.tournament.generateId(),
            name: formData.get('partnerName'),
            level: formData.get('partnerLevel'),
            description: formData.get('partnerDescription'),
            website: formData.get('partnerWebsite')
        };

        this.tournament.partners.push(partnerData);
        this.tournament.saveToLocalStorage();
        this.updatePartnersTable();
        this.showMessage('Partenaire ajouté avec succès!', 'success');
        e.target.reset();
        document.getElementById('addPartnerModal').style.display = 'none';
    }

    // Action Methods
    editSport(sportId) {
        const sport = this.tournament.sports.find(s => s.id === sportId);
        if (sport) {
            // In a real app, this would open an edit modal
            console.log('Edit sport:', sport);
        }
    }

    deleteSport(sportId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce sport?')) {
            this.tournament.removeSport(sportId);
            this.updateDashboard();
        }
    }

    editTeam(teamId) {
        const team = this.tournament.teams.find(t => t.id === teamId);
        if (team) {
            console.log('Edit team:', team);
        }
    }

    deleteTeam(teamId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette équipe?')) {
            this.tournament.teams = this.tournament.teams.filter(t => t.id !== teamId);
            this.tournament.saveToLocalStorage();
            this.updateDashboard();
        }
    }

    assignVolunteer(volunteerId) {
        const volunteer = this.tournament.volunteers.find(v => v.id === volunteerId);
        if (volunteer) {
            volunteer.assigned = !volunteer.assigned;
            this.tournament.saveToLocalStorage();
            this.updateVolunteersTable();
            this.updateMissionAssignments();
        }
    }

    deleteVolunteer(volunteerId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce bénévole?')) {
            this.tournament.volunteers = this.tournament.volunteers.filter(v => v.id !== volunteerId);
            this.tournament.saveToLocalStorage();
            this.updateDashboard();
        }
    }

    editMatch(matchId) {
        const match = this.tournament.matches.find(m => m.id === matchId);
        if (match) {
            console.log('Edit match:', match);
        }
    }

    editPartner(partnerId) {
        const partner = this.tournament.partners.find(p => p.id === partnerId);
        if (partner) {
            console.log('Edit partner:', partner);
        }
    }

    deletePartner(partnerId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce partenaire?')) {
            this.tournament.partners = this.tournament.partners.filter(p => p.id !== partnerId);
            this.tournament.saveToLocalStorage();
            this.updatePartnersTable();
        }
    }

    showQRCode(teamId) {
        const team = this.tournament.teams.find(t => t.id === teamId);
        if (team) {
            this.tournament.showQRCode(team);
        }
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        document.querySelector('.admin-content').appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Global functions
function showAddSportModal() {
    document.getElementById('addSportModal').style.display = 'block';
}

function showAddPartnerModal() {
    document.getElementById('addPartnerModal').style.display = 'block';
}

function saveScore() {
    const scoreInput = document.getElementById('scoreInput');
    const matchId = scoreInput.dataset.matchId;
    
    if (!matchId) return;

    const score1 = parseInt(document.getElementById('score1').value);
    const score2 = parseInt(document.getElementById('score2').value);

    tournament.updateMatchScore(matchId, score1, score2);
    admin.updateDashboard();
    admin.showMessage('Score enregistré!', 'success');

    // Reset form
    document.getElementById('matchToScore').value = '';
    scoreInput.style.display = 'none';
}

function saveSettings() {
    const settings = {
        tournamentName: document.getElementById('tournamentName').value,
        tournamentDate: document.getElementById('tournamentDate').value,
        tournamentLocation: document.getElementById('tournamentLocation').value,
        organizerEmail: document.getElementById('organizerEmail').value,
        organizerPhone: document.getElementById('organizerPhone').value
    };

    localStorage.setItem('tournamentSettings', JSON.stringify(settings));
    admin.showMessage('Paramètres sauvegardés!', 'success');
}

function exportData() {
    const data = {
        sports: tournament.sports,
        teams: tournament.teams,
        volunteers: tournament.volunteers,
        matches: tournament.matches,
        rankings: tournament.rankings,
        partners: tournament.partners
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tournament-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function startQRScanner() {
    admin.startQRScanner();
}

// Initialize admin dashboard
const admin = new AdminDashboard();

// Make admin available globally
window.admin = admin;
