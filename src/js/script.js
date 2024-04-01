function submitForm() {
    var email = document.getElementById('email').value;
    if (!validateEmail(email)) {
        alert("Invalid email address");
        return;
    }
    var name = document.getElementById('name').value;
    var bio = document.getElementById('bio').value;
    var photoInput = document.getElementById('photo');
    var photo = photoInput.files[0];
    if (!photo) {
        alert("Please select a profile picture");
        return;
    }
    var reader = new FileReader();
    reader.onload = function(event) {
        var photoPath = "profile_pictures/" + photo.name;
        saveProfilePicture(photo, photoPath); // Save the profile picture
        var profileData = {
            "name": name,
            "email": email,
            "bio": bio,
            "photo": photoPath
        };
        saveProfileData(profileData);
        displayProfile(profileData);
    }
    reader.readAsDataURL(photo);
}

function saveProfilePicture(photo, photoPath) {
    var formData = new FormData();
    formData.append('photo', photo);
    // Here you would typically send formData to the server to handle file saving
    // For this example, we'll just simulate saving to localStorage
    var reader = new FileReader();
    reader.onload = function(event) {
        localStorage.setItem(photoPath, event.target.result); // Save the profile picture data to localStorage
    }
    reader.readAsDataURL(photo);
}

function updateProfile() {
    // Code to handle updating profile goes here
}

function removeProfile() {
    // Code to handle removing profile goes here
}

function displayProfile(profileData) {
    var profileDiv = document.createElement('div');
    profileDiv.innerHTML = `
        <img src="${localStorage.getItem(profileData.photo)}" alt="Profile Picture">
        <p><strong>Name:</strong> ${profileData.name}</p>
        <p><strong>Email:</strong> ${profileData.email}</p>
        <p><strong>Bio:</strong> ${profileData.bio}</p>
    `;
    document.getElementById('profile').appendChild(profileDiv);
}

function saveProfileData(profileData) {
    var profiles = JSON.parse(localStorage.getItem('profiles')) || [];
    profiles.push(profileData);
    localStorage.setItem('profiles', JSON.stringify(profiles));
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Load existing profiles on page load
window.onload = function() {
    var profiles = JSON.parse(localStorage.getItem('profiles')) || [];
    profiles.forEach(function(profileData) {
        displayProfile(profileData);
    });
}
