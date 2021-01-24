const firebaseConfig = {
    apiKey: "AIzaSyBfHxylApDTgHNBBeLn1IhkaNS_Kwv_qpM",
    authDomain: "attendance-system-3eaf8.firebaseapp.com",
    projectId: "attendance-system-3eaf8",
    storageBucket: "attendance-system-3eaf8.appspot.com",
    messagingSenderId: "641310242648",
    appId: "1:641310242648:web:0314785eee2e28f9bc172d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth());

const uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            chrome.runtime.sendMessage({ message: 'sign_in' }, function(response) {
                if (response.message == 'success') {
                    window.location.replace('./main.html');
                }
            });
            return false;
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('my_sign_in').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    // signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            customParameters: {
                prompt: 'select_account'
            }
        },

        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    // tosUrl: '<your-tos-url>',
    // Privacy policy url.
    // privacyPolicyUrl: '<your-privacy-policy-url>'
};

document.getElementById('my_sign_in').addEventListener('click', () => {
    // The start method will wait until the DOM is loaded.
    ui.start('#sign_in_options', uiConfig);
})