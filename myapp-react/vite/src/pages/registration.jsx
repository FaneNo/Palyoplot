import React, { useState } from 'react';
import styles from '../cssPages/registrationPage.module.css';

function Registration() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fieldOfScience, setFieldOfScience] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({
            username,
            email,
            password,
            confirmPassword,
            fieldOfScience
        });
        // Implement what should happen on form submission
    };

    return (
        <div className={styles.registrationContainer}>
            <form onSubmit={handleSubmit} className={styles.registrationForm}>
                <h1 className={styles.registrationTitle}>Registration</h1>
                <div className={styles.formGroup}>
                    <label className={styles.registrationLabel}>Username:</label>
                    <input
                        type="text"
                        className={styles.registrationInput}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.registrationLabel}>Email:</label>
                    <input
                        type="email"
                        className={styles.registrationInput}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.registrationLabel}>Password:</label>
                    <input
                        type="password"
                        className={styles.registrationInput}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.registrationLabel}>Confirm Password:</label>
                    <input
                        type="password"
                        className={styles.registrationInput}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.registrationLabel}>Field of Science:</label>
                    <input
                        type="text"
                        className={styles.registrationInput}
                        value={fieldOfScience}
                        onChange={(e) => setFieldOfScience(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <button type="submit" className={styles.registrationButton}>Register</button>
                </div>
            </form>
        </div>
    );
}

export default Registration;