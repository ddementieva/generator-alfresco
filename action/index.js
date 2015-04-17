'use strict';
var yeoman = require('yeoman-generator');
var xml2js = require('xml2js');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
	/*
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The subgenerator name'
    });

    this.log('You called the Alfresco subgenerator with the argument ' + this.name + '.');
*/
    console.log("This is a test");
  },

  prompting: function () {
    var done = this.async();
    var myprompts = [{
      type    : 'input',
      name    : 'actionId',
      message : 'What is the ID of your Action',
    },{
      type    : 'input',
      name    : 'package',
      message : 'What is the package of your class',
    },{
      type    : 'input',
      name    : 'actionClass',
      message : 'What is the name of your action class',
    },{
      type    : 'list',
      name    : 'isAbstract',
      message : 'Is your Action abstract (true/false)',
      choices : [
        'true',
        'false'
      ]
    }];
    this.prompt(myprompts, function (answers) {
      this.answers = answers;
      // Check for Valid choices for isAbstract
      var validValue = false;
      for(var i=0; i < myprompts.length; i++) {
        var prompt = myprompts[i];
        if(prompt.name == "isAbstract" && prompt.choices !== null) {
          for(var j=0; j < prompt.choices.length; j++) {
            if(prompt.choices[j] == answers.isAbstract) {
                validValue = true;
            }
          }
        }
      }
      if(validValue == false) {
        console.log("The value for isAbstract can only be true or false");
        return new Error("The value for isAbstract can only be true or false");
      }
      if(answers.actionId == null || answers.actionId == "") {
        var errMsg = "Action Id cannot be empty";
        console.log(errMsg);
        return new Error(errMsg);
      }
      if(answers.package == null || answers.package == "") {
        var errMsg = "Class package cannot be empty";
        console.log(errMsg);
        return new Error(errMsg);
      }
      if(answers.actionClass == null || answers.actionClass == "") {
        var errMsg = "Action Class cannot be empty";
        console.log(errMsg);
        return new Error(errMsg);
      }
      console.log(answers.actionClass);
      done();
    }.bind(this));
  },

  writing: function () {
    var destContextFileName = this.answers.actionId.toLowerCase()+'-context.xml';
    var abstractAttr = null;
    if(this.answers.isAbstract == "true") {
        abstractAttr = 'abstract="true"'
    }
    this.fs.copyTpl(
      this.templatePath('action.xml'),
      this.destinationPath(destContextFileName),
      {
        actionId: this.answers.actionId,
        abstractAttr: abstractAttr,
        actionClass: this.answers.actionClass
      }
    );
    var fileData = this.fs.read(destContextFileName);
    var parser = new xml2js.Parser();
    var builder = new xml2js.Builder();
    /*
    if(this.answers.isAbstract == "false") {
      var xml = null;
      parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
        if(err) {
          console.log(err);
          return err;
        }
        var beans = result.beans.bean;
        delete beans[0].$.abstract;
        xml = builder.buildObject(result);
        console.log(xml);
      });
      this.fs.write(this.destinationPath(destContextFileName),xml);
    }
    */
    /*
    var xml = null;
    parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
      if(err) {
        console.log(err);
        return err;
      }
      var beans = result.beans.bean;
      for(var i=0; i < beans.length; i++) {
        if(beans[i].$.abstract == "false") {
          delete beans[i].$.abstract;
        }
      }
      xml = builder.buildObject(result);
      console.log(xml);
    });
    this.fs.write(this.destinationPath(destContextFileName),xml);
    */
    this.fs.copyTpl(
      this.templatePath('ActionClass.java'),
      this.destinationPath(this.answers.actionClass+".java"),
      {
        actionId: this.answers.actionId,
        package: this.answers.package,
        actionClass: this.answers.actionClass
      }
    );
  }
});
