// Native fetch is available in Node.js 18+

const BASE_URL = 'http://localhost:5000/api/v1';
const TEST_USER = {
    lin: 'TEST-STUDENT-001',
    name: 'Test Student',
    secret: 'password123',
    role: 'student'
};

async function runTests() {
    console.log('🚀 Starting API Verification...');
    let token = '';

    // 1. Register User
    try {
        console.log('Testing Registration...');
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });

        const regData = await regRes.json();
        // Allow if already registered or created
        if (regRes.ok || regData.error === 'LIN already registered') {
            console.log('✅ Registration Passed');
        } else {
            console.error('❌ Registration Failed:', regData);
        }
    } catch (e) {
        console.error('❌ Registration Error:', e.message);
    }

    // 2. Login
    try {
        console.log('Testing Login...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: TEST_USER.lin, secret: TEST_USER.secret, role: 'student' })
        });
        const loginData = await loginRes.json();

        if (loginRes.ok && loginData.session_token) {
            token = `Bearer ${loginData.session_token}`;
            console.log('✅ Login Passed');
        } else {
            console.error('❌ Login Failed:', loginData);
            return; // Cannot proceed without token
        }
    } catch (e) {
        console.error('❌ Login Error:', e.message);
        return;
    }

    // 3. Fetch Schools (Public/Auth)
    try {
        console.log('Testing Get Schools...');
        const schoolsRes = await fetch(`${BASE_URL}/schools`, {
            headers: { 'Authorization': token }
        });
        if (schoolsRes.ok) {
            console.log('✅ Get Schools Passed');
        } else {
            console.error('❌ Get Schools Failed:', schoolsRes.status);
        }
    } catch (e) {
        console.error('❌ Get Schools Error:', e.message);
    }

    // 4. AI Chat
    try {
        console.log('Testing AI Chat...');
        const chatRes = await fetch(`${BASE_URL}/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] })
        });
        const chatData = await chatRes.json();
        if (chatRes.ok && chatData.response) {
            console.log('✅ AI Chat Passed');
        } else {
            console.error('❌ AI Chat Failed:', chatData);
        }
    } catch (e) {
        console.error('❌ AI Chat Error:', e.message);
    }

    console.log('🏁 Verification Complete');
}

runTests();
