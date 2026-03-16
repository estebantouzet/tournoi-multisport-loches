// Tournament Management System
class TournamentManager {
    constructor() {
        this.sports = [];
        this.teams = [];
        this.volunteers = [];
        this.matches = [];
        this.rankings = {};
        this.partners = [];
        this.initializeDefaultSports();
        this.loadFromLocalStorage();
        this.initializeEventListeners();
        this.updateUI();
    }

    // Initialize default sports
    initializeDefaultSports() {
        const defaultSports = [
            {
                id: 'football',
                name: 'Football petit terrain',
                icon: 'fas fa-futbol',
                maxTeams: 16,
                teamSize: 5,
                poolCount: 4
            },
            {
                id: 'basket',
                name: 'Basket 3v3',
                icon: 'fas fa-basketball-ball',
                maxTeams: 12,
                teamSize: 3,
                poolCount: 3
            },
            {
                id: 'rugby',
                name: 'Rugby flag',
                icon: 'fas fa-football-ball',
                maxTeams: 8,
                teamSize: 6,
                poolCount: 2
            },
            {
                id: 'padel',
                name: 'Padel',
                icon: 'fas fa-table-tennis',
                maxTeams: 16,
                teamSize: 2,
                poolCount: 4
            },
            {
                id: 'spikeball',
                name: 'Spikeball',
                icon: 'fas fa-volleyball-ball',
                maxTeams: 8,
                teamSize: 2,
                poolCount: 2
            },
            {
                id: 'vortex',
                name: 'Lancer de vortex',
                icon: 'fas fa-bullseye',
                maxTeams: 20,
                teamSize: 1,
                poolCount: 4
            }
        ];

        if (this.sports.length === 0) {
            this.sports = defaultSports;
        }
    }

    // Local Storage Management
    saveToLocalStorage() {
        localStorage.setItem('tournamentData', JSON.stringify({
            sports: this.sports,
            teams: this.teams,
            volunteers: this.volunteers,
            matches: this.matches,
            rankings: this.rankings,
            partners: this.partners
        }));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('tournamentData');
        if (data) {
            const parsed = JSON.parse(data);
            this.sports = parsed.sports || this.sports;
            this.teams = parsed.teams || [];
            this.volunteers = parsed.volunteers || [];
            this.matches = parsed.matches || [];
            this.rankings = parsed.rankings || {};
            this.partners = parsed.partners || [];
        }
    }

    // Event Listeners
    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Forms
        document.getElementById('teamForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTeamRegistration(e);
        });

        document.getElementById('volunteerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleVolunteerRegistration(e);
        });

        document.getElementById('contactForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactForm(e);
        });

        document.getElementById('addSportForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddSport(e);
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

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Navigation
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Sports Management
    addSport(sportData) {
        const sport = {
            id: sportData.name.toLowerCase().replace(/\s+/g, '-'),
            name: sportData.name,
            icon: 'fas fa-trophy',
            maxTeams: parseInt(sportData.maxTeams),
            teamSize: parseInt(sportData.teamSize),
            poolCount: parseInt(sportData.poolCount)
        };

        this.sports.push(sport);
        this.saveToLocalStorage();
        this.updateUI();
        this.showMessage('Sport ajouté avec succès!', 'success');
    }

    removeSport(sportId) {
        this.sports = this.sports.filter(sport => sport.id !== sportId);
        this.saveToLocalStorage();
        this.updateUI();
        this.showMessage('Sport supprimé!', 'info');
    }

    // Team Registration
    handleTeamRegistration(e) {
        const formData = new FormData(e.target);
        const teamData = {
            id: this.generateId(),
            name: formData.get('teamName'),
            sport: formData.get('sport'),
            captain: formData.get('captainName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            playerCount: parseInt(formData.get('playerCount')),
            registrationDate: new Date().toISOString(),
            qrCode: this.generateQRCodeData(formData.get('teamName'))
        };

        // Check if sport has reached maximum teams
        const sport = this.sports.find(s => s.id === teamData.sport);
        const registeredTeams = this.teams.filter(t => t.sport === teamData.sport).length;
        
        if (sport && registeredTeams >= sport.maxTeams) {
            this.showMessage('Le nombre maximum d\'équipes pour ce sport est atteint!', 'error');
            return;
        }

        this.teams.push(teamData);
        this.saveToLocalStorage();
        this.updateUI();
        this.showQRCode(teamData);
        this.sendConfirmationEmail(teamData);
        this.showMessage('Équipe inscrite avec succès!', 'success');
        e.target.reset();
    }

    // Volunteer Registration
    handleVolunteerRegistration(e) {
        const formData = new FormData(e.target);
        const volunteerData = {
            id: this.generateId(),
            name: formData.get('volunteerName'),
            email: formData.get('volunteerEmail'),
            phone: formData.get('volunteerPhone'),
            availability: formData.get('availability'),
            mission: formData.get('mission'),
            registrationDate: new Date().toISOString()
        };

        this.volunteers.push(volunteerData);
        this.saveToLocalStorage();
        this.updateUI();
        this.showMessage('Merci pour votre engagement! Nous vous contacterons bientôt.', 'success');
        e.target.reset();
    }

    // Contact Form
    handleContactForm(e) {
        const formData = new FormData(e.target);
        const contactData = {
            name: formData.get('contactName'),
            email: formData.get('contactEmail'),
            message: formData.get('message'),
            date: new Date().toISOString()
        };

        // In a real application, this would send an email
        console.log('Contact form submission:', contactData);
        this.showMessage('Message envoyé! Nous vous répondrons dans les plus brefs délais.', 'success');
        e.target.reset();
    }

    // Add Sport Form
    handleAddSport(e) {
        const formData = new FormData(e.target);
        const sportData = {
            name: formData.get('sportName'),
            maxTeams: formData.get('maxTeams'),
            teamSize: formData.get('teamSize'),
            poolCount: formData.get('poolCount')
        };

        this.addSport(sportData);
        e.target.reset();
        document.getElementById('addSportModal').style.display = 'none';
    }

    // QR Code Generation
    generateQRCodeData(teamName) {
        return `TEAM-${teamName.toUpperCase()}-${Date.now()}`;
    }

    showQRCode(team) {
        const modal = document.getElementById('qrModal');
        const container = document.getElementById('qrCodeContainer');
        
        container.innerHTML = '';
        new QRCode(container, {
            text: team.qrCode,
            width: 200,
            height: 200
        });

        modal.style.display = 'block';
        modal.dataset.teamId = team.id;
    }

    downloadQRCode() {
        const canvas = document.querySelector('#qrCodeContainer canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'qrcode-team.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    }

    // Email Simulation
    sendConfirmationEmail(team) {
        console.log('Confirmation email sent to:', team.email);
        // In a real application, this would use an email service
    }

    // Tournament Generation
    generateTournament() {
        this.matches = [];
        this.rankings = {};

        this.sports.forEach(sport => {
            const sportTeams = this.teams.filter(team => team.sport === sport.id);
            if (sportTeams.length > 0) {
                this.generateSportTournament(sport, sportTeams);
            }
        });

        this.saveToLocalStorage();
        this.updateUI();
        this.showMessage('Tournoi généré avec succès!', 'success');
    }

    generateSportTournament(sport, teams) {
        const pools = this.createPools(teams, sport.poolCount);
        const poolMatches = this.generatePoolMatches(pools, sport.id);
        
        this.matches.push(...poolMatches);
        this.rankings[sport.id] = this.initializeRankings(pools);
    }

    createPools(teams, poolCount) {
        const pools = [];
        const teamsPerPool = Math.ceil(teams.length / poolCount);
        
        for (let i = 0; i < poolCount; i++) {
            const start = i * teamsPerPool;
            const end = start + teamsPerPool;
            pools.push(teams.slice(start, end));
        }
        
        return pools;
    }

    generatePoolMatches(pools, sportId) {
        const matches = [];
        let matchId = 1;

        pools.forEach((pool, poolIndex) => {
            for (let i = 0; i < pool.length; i++) {
                for (let j = i + 1; j < pool.length; j++) {
                    matches.push({
                        id: `${sportId}-pool${poolIndex}-match${matchId++}`,
                        sportId: sportId,
                        poolIndex: poolIndex,
                        team1: pool[i],
                        team2: pool[j],
                        score1: null,
                        score2: null,
                        status: 'pending',
                        time: this.generateMatchTime(matchId),
                        terrain: this.generateTerrain()
                    });
                }
            }
        });

        return matches;
    }

    initializeRankings(pools) {
        const rankings = {};
        
        pools.forEach((pool, index) => {
            rankings[`pool${index}`] = pool.map(team => ({
                team: team,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                points: 0,
                gf: 0,
                ga: 0,
                gd: 0
            }));
        });

        return rankings;
    }

    generateMatchTime(matchNumber) {
        const baseHour = 9;
        const hour = Math.floor((matchNumber - 1) / 4) + baseHour;
        const minute = ((matchNumber - 1) % 4) * 15;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    generateTerrain() {
        const terrains = ['Terrain A', 'Terrain B', 'Terrain C', 'Gymnase 1', 'Gymnase 2', 'Gymnase 3'];
        return terrains[Math.floor(Math.random() * terrains.length)];
    }

    // Live Scoring
    updateMatchScore(matchId, score1, score2) {
        const match = this.matches.find(m => m.id === matchId);
        if (match) {
            match.score1 = score1;
            match.score2 = score2;
            match.status = 'completed';
            
            this.updateRankings(match);
            this.saveToLocalStorage();
            this.updateUI();
        }
    }

    updateRankings(match) {
        const sportRankings = this.rankings[match.sportId];
        if (!sportRankings) return;

        const poolKey = `pool${match.poolIndex}`;
        const pool = sportRankings[poolKey];
        if (!pool) return;

        // Update team 1
        const team1Ranking = pool.find(r => r.team.id === match.team1.id);
        if (team1Ranking) {
            team1Ranking.played++;
            team1Ranking.gf += match.score1;
            team1Ranking.ga += match.score2;
            team1Ranking.gd = team1Ranking.gf - team1Ranking.ga;
            
            if (match.score1 > match.score2) {
                team1Ranking.won++;
                team1Ranking.points += 3;
            } else if (match.score1 === match.score2) {
                team1Ranking.drawn++;
                team1Ranking.points += 1;
            } else {
                team1Ranking.lost++;
            }
        }

        // Update team 2
        const team2Ranking = pool.find(r => r.team.id === match.team2.id);
        if (team2Ranking) {
            team2Ranking.played++;
            team2Ranking.gf += match.score2;
            team2Ranking.ga += match.score1;
            team2Ranking.gd = team2Ranking.gf - team2Ranking.ga;
            
            if (match.score2 > match.score1) {
                team2Ranking.won++;
                team2Ranking.points += 3;
            } else if (match.score2 === match.score1) {
                team2Ranking.drawn++;
                team2Ranking.points += 1;
            } else {
                team2Ranking.lost++;
            }
        }

        // Sort pool by points, then goal difference
        pool.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return b.gd - a.gd;
        });
    }

    // UI Updates
    updateUI() {
        this.updateSportsDisplay();
        this.updateTeamSelect();
        this.updatePlanning();
        this.updateLiveScores();
        this.updatePartners();
    }

    updateSportsDisplay() {
        const sportsGrid = document.getElementById('sportsGrid');
        if (!sportsGrid) return;

        sportsGrid.innerHTML = this.sports.map(sport => `
            <div class="sport-card">
                <div class="sport-actions">
                    <button onclick="tournament.removeSport('${sport.id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <i class="${sport.icon}"></i>
                <h3>${sport.name}</h3>
                <div class="sport-info">
                    <p>Max: ${sport.maxTeams} équipes</p>
                    <p>Équipe: ${sport.teamSize} joueurs</p>
                    <p>Poules: ${sport.poolCount}</p>
                </div>
            </div>
        `).join('');
    }

    updateTeamSelect() {
        const sportSelect = document.getElementById('sport');
        if (!sportSelect) return;

        sportSelect.innerHTML = '<option value="">Sélectionner un sport</option>' +
            this.sports.map(sport => {
                const registeredCount = this.teams.filter(t => t.sport === sport.id).length;
                const available = registeredCount < sport.maxTeams;
                return `<option value="${sport.id}" ${!available ? 'disabled' : ''}>
                    ${sport.name} (${registeredCount}/${sport.maxTeams})
                </option>`;
            }).join('');
    }

    updatePlanning() {
        const planningGrid = document.getElementById('planningGrid');
        if (!planningGrid) return;

        if (this.matches.length === 0) {
            planningGrid.innerHTML = '<p>Aucun match programmé. Générez le tournoi d\'abord!</p>';
            return;
        }

        planningGrid.innerHTML = this.matches.map(match => `
            <div class="match-card">
                <div class="match-time">${match.time}</div>
                <div class="match-teams">
                    <span>${match.team1.name}</span>
                    <div class="match-score">
                        ${match.score1 !== null ? `${match.score1} - ${match.score2}` : 'VS'}
                    </div>
                    <span>${match.team2.name}</span>
                </div>
                <div class="match-terrain">${match.terrain}</div>
            </div>
        `).join('');
    }

    updateLiveScores() {
        const currentMatches = document.getElementById('currentMatches');
        const rankingsContainer = document.getElementById('rankingsContainer');
        
        if (currentMatches) {
            const pendingMatches = this.matches.filter(m => m.status === 'pending');
            currentMatches.innerHTML = pendingMatches.slice(0, 5).map(match => `
                <div class="match-card">
                    <div class="match-time">${match.time}</div>
                    <div class="match-teams">
                        <span>${match.team1.name}</span>
                        <div class="match-score">VS</div>
                        <span>${match.team2.name}</span>
                    </div>
                    <div class="match-terrain">${match.terrain}</div>
                </div>
            `).join('');
        }

        if (rankingsContainer) {
            rankingsContainer.innerHTML = Object.entries(this.rankings).map(([sportId, sportRankings]) => `
                <div class="sport-rankings">
                    <h4>${this.sports.find(s => s.id === sportId)?.name}</h4>
                    ${Object.entries(sportRankings).map(([poolKey, pool]) => `
                        <div class="pool-rankings">
                            <h5>${poolKey}</h5>
                            <table class="ranking-table">
                                <thead>
                                    <tr>
                                        <th>Pos</th>
                                        <th>Équipe</th>
                                        <th>Pts</th>
                                        <th>J</th>
                                        <th>G</th>
                                        <th>N</th>
                                        <th>P</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${pool.map((ranking, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td>${ranking.team.name}</td>
                                            <td>${ranking.points}</td>
                                            <td>${ranking.played}</td>
                                            <td>${ranking.won}</td>
                                            <td>${ranking.drawn}</td>
                                            <td>${ranking.lost}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `).join('')}
                </div>
            `).join('');
        }
    }

    updatePartners() {
        const partnersGrid = document.getElementById('partnersGrid');
        if (!partnersGrid) return;

        if (this.partners.length === 0) {
            this.addDefaultPartners();
        }

        partnersGrid.innerHTML = this.partners.map(partner => `
            <div class="partner-card">
                <div class="partner-logo">
                    <i class="fas fa-building"></i>
                </div>
                <h3>${partner.name}</h3>
                <div class="partner-level">${partner.level}</div>
                <p>${partner.description}</p>
                ${partner.website ? `<a href="${partner.website}" target="_blank">Site web</a>` : ''}
            </div>
        `).join('');
    }

    addDefaultPartners() {
        this.partners = [
            {
                id: 'partner1',
                name: 'Mairie de Loches',
                level: 'Partenaire principal',
                description: 'Soutien institutionnel et mise à disposition des équipements',
                website: 'https://www.loches.fr'
            },
            {
                id: 'partner2',
                name: 'Sport&Co',
                level: 'Partenaire officiel',
                description: 'Équipementier sportif local',
                website: '#'
            },
            {
                id: 'partner3',
                name: 'Le Bar du Sport',
                level: 'Soutien local',
                description: 'Boissons et restauration pour les bénévoles',
                website: '#'
            }
        ];
        this.saveToLocalStorage();
    }

    // Utility Functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Modal Functions
    showAddSportModal() {
        document.getElementById('addSportModal').style.display = 'block';
    }

    // Live Mode
    toggleLiveMode() {
        document.body.classList.toggle('live-mode');
        if (document.body.classList.contains('live-mode')) {
            this.startLiveMode();
        } else {
            this.stopLiveMode();
        }
    }

    startLiveMode() {
        // Update live display
        this.updateLiveDisplay();
        
        // Auto-refresh every 30 seconds
        this.liveInterval = setInterval(() => {
            this.updateLiveDisplay();
        }, 30000);
    }

    stopLiveMode() {
        if (this.liveInterval) {
            clearInterval(this.liveInterval);
        }
    }

    updateLiveDisplay() {
        // This would update the live mode display
        console.log('Updating live display...');
    }

    // Admin Functions
    getStats() {
        return {
            totalTeams: this.teams.length,
            totalVolunteers: this.volunteers.length,
            totalMatches: this.matches.length,
            sportsCount: this.sports.length
        };
    }

    scanQRCode(qrData) {
        const team = this.teams.find(t => t.qrCode === qrData);
        if (team) {
            team.checkedIn = true;
            this.saveToLocalStorage();
            this.showMessage(`Équipe ${team.name} enregistrée!`, 'success');
            return team;
        }
        return null;
    }
}

// Initialize Tournament Manager
const tournament = new TournamentManager();

// Global Functions
function showAddSportModal() {
    tournament.showAddSportModal();
}

function toggleLiveMode() {
    tournament.toggleLiveMode();
}

function downloadQRCode() {
    tournament.downloadQRCode();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    tournament.updateUI();
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
});

// Export for use in other scripts
window.tournament = tournament;
