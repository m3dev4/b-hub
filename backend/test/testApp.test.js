import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app.js';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import Comment from '../models/commentModel.js';
import Like from '../models/likeModel.js';

describe('Tests de l\'application B-Hub', () => {
    let authToken;
    let userId;
    let postId;
    let commentId;
    let likeId;

    // Configuration avant tous les tests
    beforeAll(async () => {
        try {
            // Connexion à la base de données de test
            await mongoose.connect(process.env.MONGODB_URI_TEST || process.env.MONGODB_URI);
        } catch (error) {
            console.error('Erreur de connexion à la base de données:', error);
            throw error;
        }
    });

    // Nettoyage après tous les tests
    afterAll(async () => {
        try {
            // Nettoyage de la base de données
            await User.deleteMany({});
            await Post.deleteMany({});
            await Comment.deleteMany({});
            await Like.deleteMany({});
            // Fermeture de la connexion
            await mongoose.connection.close();
        } catch (error) {
            console.error('Erreur lors du nettoyage:', error);
            throw error;
        }
    });

    // Tests d'authentification
    describe('Authentication', () => {
        const testUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123!'
        };

        test('Inscription utilisateur', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            userId = response.body.user._id;
        });

        test('Connexion utilisateur', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            authToken = response.body.token;
        });
    });

    // Tests des posts
    describe('Posts', () => {
        const testPost = {
            title: 'Test Post',
            content: 'This is a test post content'
        };

        test('Création d\'un post', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testPost);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            postId = response.body._id;
        });

        test('Récupération des posts', async () => {
            const response = await request(app)
                .get('/api/posts')
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });

    // Tests des commentaires
    describe('Comments', () => {
        const testComment = {
            content: 'This is a test comment'
        };

        test('Création d\'un commentaire', async () => {
            const response = await request(app)
                .post(`/api/posts/${postId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(testComment);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            commentId = response.body._id;
        });

        test('Récupération des commentaires d\'un post', async () => {
            const response = await request(app)
                .get(`/api/posts/${postId}/comments`)
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });

    // Tests des likes
    describe('Likes', () => {
        test('Like d\'un post', async () => {
            const response = await request(app)
                .post('/api/like')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    contentType: 'post',
                    contentId: postId
                });
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            likeId = response.body._id;
        });

        test('Récupération des likes d\'un post', async () => {
            const response = await request(app)
                .get(`/api/get-likes-by-content`)
                .set('Authorization', `Bearer ${authToken}`)
                .query({
                    contentType: 'post',
                    contentId: postId
                });
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });
});