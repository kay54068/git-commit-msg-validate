'use strict';

var fs = require('fs');
var semverRegex = require('semver-regex');
var util = require('util');

var getConfig = require('./config').getConfig;

var config = getConfig();
var MAX_LENGTH = config.maxSubjectLength || 100;
var IGNORED = new RegExp(util.format('(^WIP)|(^%s$)', semverRegex().source));

// fixup! and squash! are part of Git, commits tagged with them are not intended to be merged, cf. https://git-scm.com/docs/git-commit
var PATTERN = /^((fixup! |squash! )?(\w+)(?:\(([^\)\s]+)\))?: (.+))(?:\n|$)/;
var MERGE_COMMIT_PATTERN = /^Merge /;
var PATTERN_ERROR_MSG = config.patternErrorMsg || 'does not match "<type>(<scope>): <subject>" !';

var SUBJECT_PATTERN = new RegExp(config.subjectPattern || '.+');
var SUBJECT_PATTERN_ERROR_MSG = config.subjectPatternErrorMsg || 'subject does not match subject pattern! Valid types are:';
var TYPE_PATTERN_ERROR_MSG = config.typePatternErrorMsg || 'is not allowed type ! Valid types are:';
var SCOPE_PATTERN_ERROR_MSG = config.scopeErrorMsg || 'is not an allowed scope ! Valid scope are:';
var BLANKLINE_ERROR_MSG = config.blanklineErrorMsg || 'The second line must be blank';

var error = function() {
  // gitx does not display it
  // http://gitx.lighthouseapp.com/projects/17830/tickets/294-feature-display-hook-error-message-when-hook-fails
  // https://groups.google.com/group/gitx/browse_thread/thread/a03bcab60844b812
  console[config.warnOnFail ? 'warn' : 'error']('[INVALID COMMIT MSG] ' + util.format.apply(null, arguments));
};


var msg = function() {
  // gitx does not display it
  // http://gitx.lighthouseapp.com/projects/17830/tickets/294-feature-display-hook-error-message-when-hook-fails
  // https://groups.google.com/group/gitx/browse_thread/thread/a03bcab60844b812
  console[config.warnOnFail ? 'warn' : 'error'](util.format.apply(null, arguments));
};

exports.config = config;
var TYPES = [];
var SCOPE = [];
TYPES = Object.keys(config.types)
SCOPE = Object.keys(config.scopes)
exports.validateMessage = function validateMessage(raw, sourceFile) {
  var types = TYPES = TYPES || 'conventional-commit-types';
  var AUTO_FIX = config.autoFix && sourceFile;

  //console.log("config.types[customType]",TYPES[customType]);
  // resolve types from a module
  if (typeof types === 'string' && types !== '*') {
    types = Object.keys(require(types).types);
  }
  var blankline = raw.split('\n');
  var messageWithBody = (raw || '').split('\n').filter(function(str) {
    return str.indexOf('#') !== 0;
  }).join('\n');

  var message = messageWithBody.split('\n').shift();



  if (message === '') {
    error('Aborting commit due to empty commit message.');
    return false;
  }

  var isValid = true;

  if (MERGE_COMMIT_PATTERN.test(message)) {
    error('Merge commit detected.');
    return true
  }

  if (IGNORED.test(message)) {
    error('Commit message validation ignored.');
    return true;
  }

  var match = PATTERN.exec(message);

  if (!match) {
    error(PATTERN_ERROR_MSG);
    isValid = false;
  } else {
    var firstLine = match[1];
    var squashing = !!match[2];
    var type = match[3];
    var scope = match[4];
    var subject = match[5];

    if (firstLine.length > MAX_LENGTH && !squashing) {
      error('is longer than %d characters !', MAX_LENGTH);
      isValid = false;
    }

    if (AUTO_FIX) {
      type = lowercase(type);
    }

    if (types !== '*' && types.indexOf(type) === -1) {
      error('"%s" %s\n', type,TYPE_PATTERN_ERROR_MSG );
      var i=0;
      for (var customType in config.types) {
        msg('%s: %s', TYPES[i++],config.types[customType]);
      }
      msg('\n');
      isValid = false;
    }

    isValid = validateScope(isValid, scope);

    if (AUTO_FIX) {
      subject = lowercaseFirstLetter(subject);
    }

    if (!SUBJECT_PATTERN.exec(subject)) {
      error('%s\n%s\n',SUBJECT_PATTERN_ERROR_MSG ,config.subjectPattern);
      isValid = false;
    }
  }

  if( blankline[1]  != undefined){
    if( blankline[1] != '' ){
      error(BLANKLINE_ERROR_MSG);
      return false;
    }
  }

  // Some more ideas, do want anything like this ?
  // - Validate the rest of the message (body, footer, BREAKING CHANGE annotations)
  // - auto add empty line after subject ?
  // - auto remove empty () ?
  // - auto correct typos in type ?
  // - store incorrect messages, so that we can learn

  isValid = isValid || config.warnOnFail;

  if (isValid) { // exit early and skip messaging logics
    if (AUTO_FIX && !squashing) {
      var scopeFixed = scope ? '(' + scope + ')' : '';
      var firstLineFixed = type + scopeFixed + ': ' + subject;

      if (firstLine !== firstLineFixed) {
        var rawFixed = raw.replace(firstLine, firstLineFixed);
        fs.writeFileSync(sourceFile, rawFixed);
      }
    }

    return true;
  }
  var argInHelp = config.helpMessage && config.helpMessage.indexOf('%s') !== -1;
  if (!argInHelp && config.helpMessage) {
    msg(config.helpMessage);
  }

  msg('----------------------------------------------------------------------');
  msg('[YOUR COMMIT MSG]\n');
  console.log(raw);

  // var argInHelp = config.helpMessage && config.helpMessage.indexOf('%s') !== -1;

  // if (argInHelp) {
  //   msg(config.helpMessage, messageWithBody);
  // } else if (message) {
  //   msg(message);
  // }



  return false;
};

function lowercase(string) {
  return string.toLowerCase();
}

function lowercaseFirstLetter(string) {
  return lowercase(string.charAt(0)) + string.slice(1);
}

function validateScope(isValid, scope) {
  config.scopesetting = config.scopesetting || {};
  var validateScopes = config.scopesetting.validate || false;
  var multipleScopesAllowed = config.scopesetting.multiple || false;
  var allowedScopes = SCOPE || '*';
  var scopeRequired = config.scopesetting.required || false;
  var scopes = scope ? scope.split(',') : [];

  function validateIndividualScope(item) {
    if (allowedScopes[0].trim() === '*') {
      return;
    }
    if (allowedScopes.indexOf(item) === -1) {
      error('"%s" %s\n', item, SCOPE_PATTERN_ERROR_MSG );
      var i=0;
      for (var customScope in config.scopes) {
        msg('%s: %s', SCOPE[i++],config.scopes[customScope]);
      }
      msg('\n');
      isValid = false;
    }
  }

  if (validateScopes) {
    if (scopeRequired && scopes.length === 0) {
      error('a scope is required !');
      isValid = false;
    }
    // If scope is not provided, we ignore the rest of the testing and do early
    // return here.
    if (scopes.length === 0) {
      return isValid;
    }
    if (isValid && multipleScopesAllowed) {
      scopes.forEach(validateIndividualScope);
    }
    if (isValid && !multipleScopesAllowed) {
      if (scopes.length > 1) {
        error('only one scope can be provided !');
        isValid = false;
      }
      if (isValid) {
        validateIndividualScope(scopes[0]);
      }
    }
  }
  
  return isValid;
};
