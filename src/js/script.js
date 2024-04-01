function submitForm() {
    var email = document.getElementById('email').value.trim(); // Trim spaces from email input
    var name = document.getElementById('name').value.trim(); // Trim spaces from name input
    var bio = document.getElementById('bio').value.trim(); // Trim spaces from bio input
    var photoInput = document.getElementById('photo');
    var photo = photoInput.files[0];
    
    if (!validateEmail(email)) {
        alert("Invalid email address");
        return;
    }

    if (!name) {
        alert("Please enter your name");
        return;
    }

    if (!bio) {
        alert("Please enter your bio");
        return;
    }

    if (!photo) {
        alert("Please select a profile picture");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
        var photoPath = "profile_pictures/" + photo.name;
        saveProfilePicture(photo, photoPath, name, email, bio); // Pass additional data to saveProfilePicture
    }
    reader.readAsDataURL(photo);
}

function saveProfilePicture(photo, photoPath, name, email, bio) {
    var formData = new FormData();
    formData.append('photo', photo);

    // Here you would typically send formData to the server to handle file saving
    // For this example, we'll just simulate saving to localStorage
    var reader = new FileReader();
    reader.onload = function(event) {
        localStorage.setItem(photoPath, event.target.result); // Save the profile picture data to localStorage

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


function updateProfile() {
    var updateContainer = document.createElement('div');
    updateContainer.classList.add('form-container');
    
    var email = document.createElement('input');
    email.type = 'email';
    email.placeholder = 'Email';
    email.id = 'update-email';

    var password = document.createElement('input');
    password.type = 'password';
    password.placeholder = 'Password';
    password.id = 'update-password';

    var submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.onclick = function() {
        var inputEmail = document.getElementById('update-email').value;
        var inputPassword = document.getElementById('update-password').value;
        
        // Grant admin permission if email contains 'conan'
        if (inputEmail.toLowerCase().includes('conan')) {
            // Clear existing form
            var existingForm = document.querySelector('.form-container');
            existingForm.parentNode.removeChild(existingForm);

            // Create new form for updating profile info
            var updateInfoContainer = document.createElement('div');
            updateInfoContainer.classList.add('form-container');

            var nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.placeholder = 'Name';
            nameInput.value = localStorage.getItem('name');

            var updatedEmail = document.createElement('input');
            updatedEmail.type = 'email';
            updatedEmail.placeholder = 'Email';
            updatedEmail.value = localStorage.getItem('email');

            var updatedPassword = document.createElement('input');
            updatedPassword.type = 'password';
            updatedPassword.placeholder = 'Password';
            updatedPassword.value = localStorage.getItem('password');

            var bioInput = document.createElement('textarea');
            bioInput.placeholder = 'Bio';
            bioInput.style.resize = 'vertical';
            bioInput.style.maxHeight = '200px';
            bioInput.value = localStorage.getItem('bio');

            var submitUpdateBtn = document.createElement('button');
            submitUpdateBtn.textContent = 'Submit';
            submitUpdateBtn.onclick = function() {
                localStorage.setItem('name', nameInput.value);
                localStorage.setItem('email', updatedEmail.value);
                localStorage.setItem('password', updatedPassword.value);
                localStorage.setItem('bio', bioInput.value);
                alert('Profile updated successfully!');
            };

            var backBtn = document.createElement('button');
            backBtn.textContent = 'Back';
            backBtn.onclick = function() {
                updateInfoContainer.parentNode.removeChild(updateInfoContainer);
                document.querySelector('.container').appendChild(updateContainer);
            };

            updateInfoContainer.appendChild(nameInput);
            updateInfoContainer.appendChild(updatedEmail);
            updateInfoContainer.appendChild(updatedPassword);
            updateInfoContainer.appendChild(bioInput);
            updateInfoContainer.appendChild(submitUpdateBtn);
            updateInfoContainer.appendChild(backBtn);

            document.querySelector('.container').appendChild(updateInfoContainer);
        } else {
            // Normal user, perform password verification
            var storedEmail = localStorage.getItem('email');
            var storedPassword = localStorage.getItem('password');

            if (inputEmail === storedEmail && inputPassword === storedPassword) {
                // Proceed with updating profile
                // Code to update profile goes here
                alert('Profile updated successfully!');
            } else {
                alert('Invalid email or password');
            }
        }
    };

    var backBtn = document.createElement('button');
    backBtn.textContent = 'Back';
    backBtn.onclick = function() {
        updateContainer.parentNode.removeChild(updateContainer);
        document.querySelector('.container').appendChild(formContainer);
    };

    updateContainer.appendChild(email);
    updateContainer.appendChild(password);
    updateContainer.appendChild(submitBtn);
    updateContainer.appendChild(backBtn);

    var formContainer = document.querySelector('.form-container');
    formContainer.parentNode.replaceChild(updateContainer, formContainer);
}



function removeProfile() {
    var removeContainer = document.createElement('div');
    removeContainer.classList.add('form-container');

    var permissionInput = document.createElement('input');
    permissionInput.type = 'text';
    permissionInput.placeholder = 'Permission code (Conan)';
    permissionInput.id = 'permission-input';

    var submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.onclick = function() {
        var permissionCode = document.getElementById('permission-input').value.trim().toLowerCase();

        // Check permission code
        if (permissionCode === 'conan') {
            // Clear existing form
            var existingForm = document.querySelector('.form-container');
            existingForm.parentNode.removeChild(existingForm);

            // Create new form for searching user info
            var searchContainer = document.createElement('div');
            searchContainer.classList.add('form-container');

            var emailInput = document.createElement('input');
            emailInput.type = 'email';
            emailInput.placeholder = 'Email';
            emailInput.id = 'search-email';

            var searchBtn = document.createElement('button');
            searchBtn.textContent = 'Search';
            searchBtn.onclick = function() {
                var searchEmail = document.getElementById('search-email').value.trim().toLowerCase();
                var profiles = JSON.parse(localStorage.getItem('profiles')) || [];
                var foundProfile = profiles.find(function(profile) {
                    return profile.email === searchEmail;
                });
                if (foundProfile) {
                    displayProfileToRemove(foundProfile);
                } else {
                    alert('Profile not found');
                }
            };

            searchContainer.appendChild(emailInput);
            searchContainer.appendChild(searchBtn);

            document.querySelector('.container').appendChild(searchContainer);
        } else {
            alert('Invalid permission code');
        }
    };

    removeContainer.appendChild(permissionInput);
    removeContainer.appendChild(submitBtn);

    var formContainer = document.querySelector('.form-container');
    formContainer.parentNode.replaceChild(removeContainer, formContainer);
}

function displayProfileToRemove(profileData) {
    var profileDiv = document.createElement('div');
    profileDiv.innerHTML = `
        <p><strong>Name:</strong> ${profileData.name}</p>
        <p><strong>Email:</strong> ${profileData.email}</p>
        <p><strong>Bio:</strong> ${profileData.bio}</p>
    `;

    var removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = function() {
        removeProfileData(profileData.email);
        profileDiv.parentNode.removeChild(profileDiv);
        alert('Profile removed successfully!');
    };

    var backBtn = document.createElement('button');
    backBtn.textContent = 'Back';
    backBtn.onclick = function() {
        removeBtn.parentNode.removeChild(removeBtn);
        backBtn.parentNode.removeChild(backBtn);
        profileDiv.parentNode.removeChild(profileDiv);
        removeProfile();
    };

    profileDiv.appendChild(removeBtn);
    profileDiv.appendChild(backBtn);

    document.querySelector('.container').appendChild(profileDiv);
}

function removeProfileData(email) {
    var profiles = JSON.parse(localStorage.getItem('profiles')) || [];
    var updatedProfiles = profiles.filter(function(profile) {
        return profile.email !== email;
    });
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
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
