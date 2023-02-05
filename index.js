import mongoose from 'mongoose';
import Blog from './model/blog.js';
import User from './model/user.js';
import * as dotenv from 'dotenv';
dotenv.config();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI);
// const user = await User.create({
//   name: 'John Doe',
//   email: 'johnDoe@gmail.com',
// });
// const article = await Blog.create({
//   title: 'Learing Mongoose - 3',
//   slug: 'Learning-Mngoose3',
//   author: user._id,
//   content: 'Writing my first mongoose',
//   tags: ['featured'],
// });
// console.log(article);
// // // await article.save();
// // const firstArticle = await Blog.find();
// article.title = 'This is a new title';
// article.save();

// const article = await Blog.findById(
//   '63cfe0b53bdc778849cd1072',
//   'title author content'
// ).exec();
// const blog = await Blog.deleteOne({ title: 'Learing Mongoose' });
// const blog = await Blog.deleteMany({ title: 'Learing Mongoose' });
// console.log('blog', blog);
// console.log(`My first mongoose article: ${article}`);
// const blog = await Blog.exists({ author: 'Alli Olarinde' });
// const blogFind = await Blog.findOne({ author: 'Alli Olarinde' });
// // using the where method

// const blogWhere = await Blog.where('author').equals('Alli Olarinde');
// const blogWhere2 = await Blog.where('author')
//   .equals('Alli Olarinde')
//   .select('title author content');
// console.log(blogWhere2);

// const article = await Blog.findOne({ title: 'Learing Mongoose - 3' }).populate(
//   'author'
// );
const article = await Blog.findById('63cfe9e0e0aa3894b98073db').exec();
article.title = 'Updated Title';
await article.save();
console.log(article);
