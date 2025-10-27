// --- Header Component ---
const Header = {
  template: `
    <header class="navbar">
    <div class="features">
  <div class="feature-box" style="max-width:400px;margin:auto;padding:2rem;">
  
      <div class="logo">🎟Tasket</div>
      <nav>
        <a href="#" @click.prevent="$root.navigate('/')">Home</a>
        <a href="#" @click.prevent="$root.navigate('/dashboard')">Dashboard</a>
        <a href="#" @click.prevent="$root.navigate('/tickets')">Tickets</a>
        <button class="btn" @click="logout">Logout</button>
          </div>
</div>
      </nav>
    </header>
  `,
  methods: {
    logout() {
      localStorage.removeItem('ticketapp_session');
      this.$root.navigate('/auth/login');
    }
  }
};

// --- Footer Component ---
const Footer = {
  template: `<footer>&copy; 2025 Tasket. All rights reserved.</footer>`
};

// --- Toast Component ---
const Toast = {
  template: `
    <div v-if="visible" 
         :style="{position:'fixed',bottom:'20px',right:'20px',background:'#333',color:'#fff',padding:'10px 20px',borderRadius:'5px',opacity:0.9}">
      {{ message }}
    </div>
  `,
  data() { return { visible: false, message: '' }; },
  methods: {
    show(msg) {
      this.message = msg;
      this.visible = true;
      setTimeout(() => { this.visible = false; }, 2500);
    }
  }
};

// --- Landing Page ---
const LandingPage = {
  template: `
    <div>
      <Header></Header>
      <section class="hero">
        <div class="circle"></div>
        <div class="hero-content">
          <h2>Welcome to Tasket</h2>
          <p>Manage your tickets seamlessly</p>
          
          <div class="buttons">
            <a href="#" @click.prevent="$root.navigate('/auth/login')" class="btn primary">Login</a>
            <a href="#" @click.prevent="$root.navigate('/auth/signup')" class="btn secondary">Sign Up</a>
          </div>
        </div>
        <div class="wave">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z"></path>
          </svg>
          <div class="circle" style="top:10%;right:5%;width:60px;height:60px;"></div>
        </div>
      </section>

      <section class="features">
        <h3>Features</h3>
        <div class="feature-grid">
          <div class="feature-box">Create tickets quickly</div>
          <div class="feature-box">Track ticket progress</div>
          <div class="feature-box">Resolve issues efficiently</div>
        </div>
      </section>

      <Footer></Footer>
    </div>
  `,
  components: { Header, Footer }
};

// --- Login Page ---
const Login = {
  template: `
    <div class="feature-box" style="max-width:400px;margin:50px auto;padding:2rem;">
      <h2 style="text-align:center;margin-bottom:1rem;">Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border rounded-lg" required />
        <input v-model="password" type="password" placeholder="Password" class="w-full p-2 border rounded-lg" required />
        <button type="submit" class="btn primary w-full">Login</button>
      </form>
      <p style="text-align:center;margin-top:1rem;">
        Don’t have an account? <a href="#" @click.prevent="$root.navigate('/auth/signup')">Sign up</a>
      </p>
      <Toast ref="toast"></Toast>
    </div>
  `,
  data() { return { email: '', password: '' }; },
  components: { Toast },
  methods: {
    handleLogin() {
      const user = JSON.parse(localStorage.getItem('ticketapp_session'));
      if(user && user.email === this.email && user.password === this.password){
        this.$refs.toast.show('Login successful!');
        setTimeout(() => this.$root.navigate('/dashboard'), 500);
      } else this.$refs.toast.show('Invalid credentials!');
    }
  }
};

// --- Signup Page ---
const Signup = {
  template: `
    <div class="feature-box" style="max-width:400px;margin:50px auto;padding:2rem;">
      <h2 style="text-align:center;margin-bottom:1rem;">Sign Up</h2>
      <form @submit.prevent="handleSignup" class="space-y-4">
        <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border rounded-lg" required />
        <input v-model="password" type="password" placeholder="Password" class="w-full p-2 border rounded-lg" required />
        <button type="submit" class="btn primary w-full">Sign Up</button>
      </form>
      <p style="text-align:center;margin-top:1rem;">
        Already have an account? <a href="#" @click.prevent="$root.navigate('/auth/login')">Login</a>
      </p>
      <Toast ref="toast"></Toast>
    </div>
  `,
  data() { return { email: '', password: '' }; },
  components: { Toast },
  methods: {
    handleSignup() {
      if(this.email && this.password){
        localStorage.setItem('ticketapp_session', JSON.stringify({email:this.email,password:this.password}));
        this.$refs.toast.show('Account created!');
        setTimeout(() => this.$root.navigate('/dashboard'), 500);
      } else this.$refs.toast.show('Fill all fields!');
    }
  }
};

// --- Dashboard Page ---
const Dashboard = {
  template: `
    <div>
      <Header></Header>
      <section class="features" style="margin-top:2rem;">
        <h3>Dashboard</h3>
        <div class="feature-grid">
          <div class="feature-box">
            <h4>Total Tickets</h4>
            <p>{{ tickets.length }}</p>
          </div>
          <div class="feature-box">
            <h4>Open Tickets</h4>
            <p>{{ countStatus('open') }}</p>
          </div>
          <div class="feature-box">
            <h4>Resolved Tickets</h4>
            <p>{{ countStatus('closed') }}</p>
          </div>
        </div><div style="margin-top:1rem; display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
  <button class="btn primary" @click="$root.navigate('/tickets')">Manage Tickets</button>
<button class="btn secondary" @click="logout">Logout</button>
</div>
        
      </section>
      <Footer></Footer>
      <Toast ref="toast"></Toast>
    </div>
  `,
  components:{ Header, Footer, Toast },
  data(){ return { tickets: JSON.parse(localStorage.getItem('tickets') || '[]') }; },
  methods:{
    countStatus(s){ return this.tickets.filter(t=>t.status===s).length; },
    logout(){ localStorage.removeItem('ticketapp_session'); this.$refs.toast.show('Logged out!'); setTimeout(()=>this.$root.navigate('/auth/login'),500); }
  }
};

// --- Ticket Management Page ---
const TicketManagement = {
  template: `
    <div>
      <Header></Header>
      <section class="features" style="margin-top:2rem;">
        <h3>Tickets</h3>
        <div class="feature-box" style="margin-bottom:1rem;">
          <input v-model="title" placeholder="Title" class="w-full p-2 border rounded-lg" />
          <select v-model="status" class="w-full p-2 border rounded-lg">
            <option disabled value="">Select Status</option>
            <option>open</option>
            <option>in_progress</option>
            <option>closed</option>
          </select>
          <textarea v-model="description" placeholder="Description" class="w-full p-2 border rounded-lg"></textarea>
          <button @click="createTicket" class="btn primary w-full">Add Ticket</button>
        </div>
        <div class="feature-grid">
          <div v-for="ticket in tickets" :key="ticket.id" class="feature-box">
            <h4>{{ ticket.title }}</h4>
            <span :style="{color: statusColor(ticket.status)}">{{ ticket.status }}</span>
            <p>{{ ticket.description }}</p>
            <button @click="editTicket(ticket)" class="btn secondary">Edit</button>
          <button @click="deleteTicket(ticket.id)" class="btn danger">Delete</button>
          </div>
        </div>
      </section>
      <Footer></Footer>
      <Toast ref="toast"></Toast>
    </div>
  `,
  components:{ Header, Footer, Toast },
  data(){ return { tickets: JSON.parse(localStorage.getItem('tickets')||'[]'), title:'', status:'', description:'' }; },
  methods:{
    statusColor(s){ return s==='open'?'green':s==='in_progress'?'orange':'gray'; },
    saveTickets(){ localStorage.setItem('tickets', JSON.stringify(this.tickets)); },
    createTicket(){
      if(!this.title || !['open','in_progress','closed'].includes(this.status)){
        this.$refs.toast.show('Invalid title or status!');
        return;
      }
      this.tickets.push({id:Date.now(), title:this.title, status:this.status, description:this.description});
      this.title=''; this.status=''; this.description='';
      this.saveTickets();
      this.$refs.toast.show('Ticket added!');
    },
    deleteTicket(id){ this.tickets=this.tickets.filter(t=>t.id!==id); this.saveTickets(); this.$refs.toast.show('Ticket deleted!'); },
    editTicket(ticket){
      const newTitle = prompt('Title',ticket.title);
      const newStatus = prompt('Status',ticket.status);
      if(newTitle && ['open','in_progress','closed'].includes(newStatus)){
        ticket.title=newTitle; ticket.status=newStatus; this.saveTickets();
        this.$refs.toast.show('Ticket updated!');
      } else this.$refs.toast.show('Invalid update!');
    }
  }
};

// --- Routes ---
const routes = {
  '/': LandingPage,
  '/auth/login': Login,
  '/auth/signup': Signup,
  '/dashboard': Dashboard,
  '/tickets': TicketManagement
};

// --- Vue App ---
const app = Vue.createApp({
  data(){ return { currentRoute: window.location.pathname }; },
  computed:{ ViewComponent(){ return routes[this.currentRoute]||LandingPage; } },
  render(){ return Vue.h(this.ViewComponent); },
  methods:{ navigate(path){ history.pushState(null,'',path); this.currentRoute=path; } },
  created(){ window.addEventListener('popstate',()=>{ this.currentRoute=window.location.pathname; }); }
});

app.mount('#app');