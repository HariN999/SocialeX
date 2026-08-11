import Users from '../models/Users.js';

export const searchUsers = async (req, res) => {
    try {
        const q = (req.query.q || '').trim();

        if (!q) {
            return res.status(200).json({ users: [] });
        }

        const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');

        const users = await Users.find(
            { username: regex },
            { _id: 1, username: 1, profilePic: 1 }
        ).limit(20);

        return res.status(200).json({ users });
    } catch (err) {
        return res.status(500).json({ message: 'Server error searching users' });
    }
};
