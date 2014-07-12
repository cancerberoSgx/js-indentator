Some personal notes about Object Oriented paradigm in JavaScript
======================

jsdoc like tools try to define a documentation format of javascript code from the Object Oriented perspective, this is, 
using concepts like class, attributes or properties, methods, inheritance, modules, statics. In this document we try 
to describe exactly what each of those means from the JavaScript perspective. 

Why do this? Because JavaScript language paradigm is not Object Oriented but prototype and so many OO concepts like mentioned 
don't have a direct meaning, or can be interpreted in different JavaScript terms

Classes
=========

What is a class in JavaScript? 
In general a name that you can use for instantiate new instances using the JavaScript keyword 'new'. 

For example, in the code 'var b = new Animal()' we say that the name 'Animal' is a class. 

Also, we say that in the expression 'new Animal()' we are calling the Animal class' *constructor*. 

In JavaScript we define a class using a function. The function will both represent the class and its constructor: 

    var Animal = function(){}   //define the class Animal
    var toby = new Animal()     //instantiate an animal

Also notice that we instantiated a new Animal named toby that will be a JavaScript Object. We say that the object 'toby' is an instance of the class 'Animal'. 

By convention, class names always start with uppercase letters and instance names always start with lowercase.

Class Instances
==============
class instances are simple plain old javascript objects. Two objects are of the same class if they were instantiated using the 

Class attributes
================

A class define an entity that will contain some attributes this is names with a value associated

Class Inheritance
================

    var Animal = function(){}; 
    Animal.prototype.eat = function(food) {
        this.weight++;
    };

Class Inheritance: Calling super
==================
Something to take into account when defining subclasses and particularly when overriding methods is to know how to call the superclass methods. This is particular important for class constructors: if some instance initialization logic is performed at the constructor then the subclasses constructor should call the superclass constructor for make sure this logic is executed and then perhaps perform subclass initialization logic. 

In the following code we show two examples of calling super, the first calling the super class constructor and the second calling a super class method. You will notice that for calling super we must reffer to the suerclass explicitly and we can use 'Function.apply()' and 'arguments' variable for doing it everywhere using the same syntax:

    var Animal = function(){
        this.weight = 2;
    }; 
    Animal.prototype.eat = function(food) {
        this.weight++;
    };
    Animal.prototype.run = function(destination){}
    var Cat = function(){
        Animal.apply(this, arguments); //call super class constructor
    }; 
    Cat.prototype = new Animal(); // Cat extends Animal
    //Cat overrides eat() method because Cat always run after eating.
    Cat.prototype.eat = function(food) { 
        Cat.prototype.eat.apply(this, arguments); //call super
        this.run(); //and then run!
    }
    var moya = new Cat(); //instance a new Cat
    moya.eat('that'); 
 





Dynamic attributes and methods
==============================

we say a class attribute is dynamic when we can override it in subclasses so each instance has its own definition dependening

Static attributes and method
==============================
Now, we have
