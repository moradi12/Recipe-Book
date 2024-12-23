import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';

// Interface for user response
interface UserResponse {
    id: number;
    username: string;
    email: string;
    userType: string;
}

const UserAuth: React.FC = () => {
    const [authMessage, setAuthMessage] = useState<string>('');
    const [token, setToken] = useState<string>('');

    // Get all users with the token
    const getAllUsers = async () => {
        if (!token) {
            setAuthMessage('You must be logged in first.');
            return;
        }

        try {
            const response = await axios.get<UserResponse[]>('http://localhost:8080/api/users', {
                headers: { Authorization: token },
            });
            console.log('All Users:', response.data);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                setAuthMessage(`Error fetching users: ${error.response ? error.response.data : error.message}`);
            } else {
                setAuthMessage(`Error fetching users: ${error}`);
            }
        }
    };

    // Delete a user by ID
    const deleteUser = async (id: number) => {
        if (!token) {
            setAuthMessage('You must be logged in first.');
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/users/${id}`, {
                headers: { Authorization: token },
            });
            setAuthMessage('User Deleted');
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                setAuthMessage(`Error deleting user: ${error.response ? error.response.data : error.message}`);
            } else {
                setAuthMessage(`Error deleting user: ${error}`);
            }
        }
    };

    return (
        <div>
            <h2>User Authentication</h2>

            <div>
                <input
                    type="text"
                    placeholder="Enter Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />
            </div>

            <div>
                {token && (
                    <div>
                        <button onClick={getAllUsers}>Get All Users</button>
                        <button onClick={() => deleteUser(1)}>Delete User (ID 1)</button>
                    </div>
                )}
            </div>

            <p>{authMessage}</p>
        </div>
    );
};

export default UserAuth;
