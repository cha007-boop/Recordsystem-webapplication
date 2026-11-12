app.component('book-details', {
    props: {
        prop1: {
            type: Array,
            required: true
        }
    },
    template:
        /*html*/
        `<!-- Login status and button -->
        <div class="d-flex align-items-center gap-2">
            <span v-if="userInfo" class="badge text-bg-success">
                Logged in as {{ userInfo.username }}
            </span>
            <span v-else class="badge text-bg-secondary">Not logged in</span>
            <!-- Log out button -->
            <button v-if="userInfo" type="button" class="btn btn-outline-secondary btn-sm" @click="logout">
                Log out
            </button>
            <!-- Dropdown menu for logging in -->
            <div v-else class="dropdown">
                <!-- This opens the dropdown -->
                <button id="loginDropdown" type="button" class="btn btn-primary btn-sm" data-bs-toggle="dropdown"
                    data-bs-auto-close="outside" aria-expanded="false" @click="authMessage = ''">
                    Log in
                </button>
                <!-- The dropdown -->
                <div class="dropdown-menu dropdown-menu-end login-dropdown p-3 shadow">
                    <!-- prevent to not reload page on form submit -->
                    <form @submit.prevent="login">
                        <h2 class="h5 mb-3">Log in</h2>
                        <div class="mb-3">
                            <label for="loginUsername" class="form-label">Username</label>
                            <input id="loginUsername" v-model.trim="auth.username" class="form-control"
                                autocomplete="username" required>
                        </div>
                        <div class="mb-3">
                            <label for="loginPassword" class="form-label">Password</label>
                            <input id="loginPassword" v-model="auth.password" type="password" class="form-control"
                                autocomplete="current-password" required>
                        </div>
                        <p v-if="authMessage" class="alert alert-danger mb-3" role="alert">
                            {{ authMessage }}
                        </p>
                        <button type="submit" class="btn btn-primary w-100" :disabled="isLoggingIn">
                            {{ isLoggingIn ? 'Logging in...' : 'Log in' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
        `
})