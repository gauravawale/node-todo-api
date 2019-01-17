const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {Users} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
   it('should create a new todo', (done) => {
      let text = 'test todo text';

      request(app)
          .post('/todos')
          .set('x-auth', users[0].tokens[0].token)
          .send({text})
          .expect(200)
          .expect((res) => {
              expect(res.body.text).toBe(text);
          })
          .end((err, res) => {
              if (err)
                  return done(err);

              Todo.find({text}).then((todos) => {
                  expect(todos.length).toBe(1);
                  expect(todos[0].text).toBe(text);
                  done();
              }).catch(e => done(e));
          });
   });

    it('should not create a new todo with invalid body data', (done) => {
        let text = 'test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should return all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });

});

describe('GET /todos/:id', () =>{
   it('should return doc', (done) => {
       request(app)
           .get(`/todos/${todos[0]._id.toHexString()}`)
           .set('x-auth', users[0].tokens[0].token)
           .expect(200)
           .expect(res => {
               expect(res.body.todo.text).toBe(todos[0].text);
           })
           .end(done);
   });

    it('should not return doc created by other user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        let hexId = new ObjectId().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non object ids', (done) => {
        request(app)
            .get(`/todos/1234`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () =>{
    it('should remove a todo', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end((err, res) => {
                if (err)
                    return done(err);
                Todo.findById(todos[0]._id).then((todos) => {
                    expect(todos).toBeFalsy();
                    return done();
                }).catch(e => done(e));
            });
    });

    it('should not remove a todo creator by other user', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        let hexId = new ObjectId().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id is not correct', (done) => {
        request(app)
            .delete(`/todos/1234`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id ', () =>{
    it('should update a todo', (done) => {
        let hexId = todos[0]._id.toHexString()
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                "completed": true
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeTruthy();
            })
            .end(done);
    });

    it('should not update a todo created by other user', (done) => {
        let hexId = todos[0]._id.toHexString()
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                "completed": true
            })
            .expect(404)
            .end(done);
    });

    it('should clear completedAt when the todo is not completed', (done) => {
        let hexId = todos[1]._id.toHexString()
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                "completed": false
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        let hexId = new ObjectId().toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id is not correct', (done) => {
        request(app)
            .patch(`/todos/1234`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

});

describe('POST /users', () => {
    let email = 'example@example.com';
    let password = '123acb';
    it('should create user', (done) => {
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end(err => {
                if(err)
                    return done(err);

                Users.findOne({email}).then(user => {
                   expect(user).toBeTruthy();
                   expect(user.password).not.toBe(password);
                   done();
                }).catch(e => {
                    done(e);
                });
            });

    });

    it('should return validation error if request invalid', (done) => {
        let email = 'exampleexample.com';
        let password = '123acb';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(err => {
                if(err)
                    return done(err);
                Users.findOne({email}).then(user => {
                    expect(user).toBeFalsy();
                    done();
                });
            });
    });

    it('should not create user if email in use', (done) => {
        let email = users[0].email;
        let password = '123acb';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
   it('should login user and return auth token', (done) => {
       request(app)
           .post('/users/login')
           .send({
               email: users[1].email,
               password: users[1].password
           })
           .expect(200)
           .expect(res => {
               expect(res.headers['x-auth']).toBeTruthy();
           })
           .end((err, res) => {
               if(err)
                   return done(err);
               Users.findById(users[1]._id).then(user => {
                   expect(user.tokens[1]).toMatchObject({
                       //_id: res.body._id,
                       //access: 'auth',
                       token: res.headers['x-auth']
                   });
                   done();
               }).catch(e => {
                   done(e);
               });
           });
   });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + 1
            })
            .expect(400)
            .expect(res => {
                expect(res.text).toEqual('Password is incorrect');
            })
            .end((err, res) => {
                if(err)
                    return done(err);
                Users.findById(users[1]._id).then(user => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch(e => {
                    done(e);
                });
            });
    });
});

describe('DELETE /users/me/token', () => {
   it('should remove auth token on logout', (done) => {
       request(app)
           .delete('/users/me/token')
           .set('x-auth', users[0].tokens[0].token)
           .expect(200)
           .end((err, res) => {
              if (err)
                  return done(err);
              Users.findById(users[0]._id).then(user => {
                  expect(user.tokens.length).toBe(0);
                  done();
              }).catch(e => done(e));
           });
   });
});