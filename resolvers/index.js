var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/confiq');
const db = require('../models');
const Comment = db.comments;
const News = db.newss;
const User = db.users;

const resolvers = {
    Query: {
        newss: () => {
            return News.findAll()
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return err;
                });
        },
        users: (parent, args, context) => {
            if (!context.data)
                return [];
            else
                return User.findAll()
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        return err;
                    });
        },
        comments: () => {
            return Comment.findAll()
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return err;
                });
        },

    },

    Mutation: {
        register: (parent, { name, email, username, password }) => {
            var hashpass = bcrypt.hashSync(password, 8);
            var user = {
                name: name,
                email: email,
                username: username,
                password: hashpass
            }
            return User.create(user)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return {};
                });
        },
        login: (parent, { username, password }) => {

            return User.findOne({ where: { username: username } })
                .then(data => {
                    if (data) {
                        var loginValid = bcrypt.compareSync(password, data.password);
                        if (loginValid) {

                            var payload = {
                                userid: data.id,
                                username: username
                            };
                            let token = jwt.sign(
                                payload,
                                config.secret, {
                                expiresIn: '3h'
                            }
                            );
                            let dt = new Date(); // now
                            dt.setHours(dt.getHours() + 3); // now + 3h

                            return {
                                success: true,
                                token: token,
                                expired: dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString()
                            };
                        } else {
                            return {};
                        }
                    } else {
                        return {};
                    }
                })
                .catch(err => {
                    return {};
                });
        },
        addNews: (parent, { judul, kategori, gambar, desc }, context) => {
            if (!context.data)
                return [];
            else {
                var news = {
                    judul: judul,
                    kategori: kategori,
                    gambar: gambar,
                    desc: desc
                }
                return News.create(news)
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        return {};
                    });
            }
        },
        detailNews: (parent, { id }) => {
            var id = id;
            return News.findOne({
                //include: [Comment],
                include: {
                    model: Comment,
                },
                where: { id: id }
            })
                .then(data => {
                    if (data) {
                        return data;
                    } else {
                        return {};
                    }
                })
                .catch(err => {
                    return {};
                });
        },
        updateNews: (parent, { id, judul, kategori, gambar, desc }, context) => {
            if (!context.data)
                return [];
            else {
                var id = id;
                var news = {
                    judul: judul,
                    kategori: kategori,
                    gambar: gambar,
                    desc: desc
                }

                return News.update(news, {
                    where: { id: id }
                })
                    .then(data => {
                        return " data berhasil di update";
                    })
                    .catch(err => {
                        return {};
                    });
            }

        },
        deleteNews: (parent, { id }, context) => {
            if (!context.data)
                return [];
            else {
                var id = id;
                return News.destroy({
                    where: { id: id }
                })
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        return {};
                    });
            }
        },
        addComment: (parent, { description, newsId }) => {
            var comment = {
                description: description,
                newsId: newsId
            }
            return Comment.create(comment)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return {};
                });
        },

    }
};

module.exports = resolvers;