const authURL = 'https://restfulrecordsapi-gcg3dxbvhzekabdc.italynorth-01.azurewebsites.net/api/Auth/login'

app.component('login-dropdown', {
    props: {
        userInfo: {
            type: Object,
            required: false,
            default: { username: '', role: '', token: '' }
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
            <div v-else class="">
                <!-- This opens the dropdown -->
                <button id="loginDropdown" type="button" class="btn btn-primary btn-sm" data-bs-toggle="dropdown"
                    data-bs-auto-close="outside" aria-expanded="false" @click="authMessage = ''">
                    Log in
                </button>
                <!-- The dropdown -->
                <div>
                <!-- class="dropdown-menu dropdown-menu-end login-dropdown p-3 shadow"> --> 
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
        `,
    data() {
        return {
            auth: { username: '', password: '' },
            userInfo: null,
            authMessage: '',
            isLoggingIn: false
        }
    },
    methods: {
        parseJwt(token) {
            const payload = token.split('.')[1];

            // Convert Base64URL to regular Base64
            const base64 = payload
                .replace(/-/g, '+')
                .replace(/_/g, '/');

            // Decode and convert to JSON
            const decodedPayload = atob(base64);

            return JSON.parse(decodedPayload);
        },
        login() {
            this.isLoggingIn = true
            this.authMessage = ''

            axios
                .post(authURL, this.auth)
                .then(response => {
                    if (!response.data?.token) {
                        throw new Error('The login response did not include an authentication token.')
                    }

                    this.userInfo = {
                        username: this.auth.username,
                        role: this.parseJwt(response.data.token)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
                        token: response.data.token
                    }
                    localStorage.setItem(tokenName, JSON.stringify(this.userInfo))
                    this.auth.password = ''
                    bootstrap.Dropdown.getOrCreateInstance(document.getElementById('loginDropdown')).hide()
                    this.$emit('login-event', this.userInfo)
                })
                .catch((error) => {
                    this.authMessage = this.getRequestErrorMessage(error)
                })
                .finally(() => {
                    this.isLoggingIn = false
                })

        },
        logout() {
            localStorage.removeItem(tokenName)
            this.userInfo = null
            this.auth = { username: '', password: '' }
        },
        getRequestErrorMessage(error) {
            const responseData = error.response?.data
            if (typeof responseData === 'string') {
                return responseData
            }
            if (responseData?.title || responseData?.message) {
                return responseData.title || responseData.message
            }
            if (responseData && typeof responseData === 'object') {
                return JSON.stringify(responseData)
            }
            return error.message || 'The request failed.'
        },
    }
})