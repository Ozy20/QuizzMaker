const AJV = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new AJV();
addFormats(ajv);
const schema = {
    "type": "object",
    "properties": {
        "name": { "type": "string", "minLength": 3, "maxLength": 50 },
        "email": { "type": "string", "format": "email" },
        "userName": { "type": "string", "minLength": 3, "maxLength": 20 },
        "password": { 
            "type": "string", 
            "minLength": 6, 
            "maxLength": 20, 
        },
        "userRole": { 
            "type": "string", 
            "enum": ["teacher", "student"], 
            "default": "teacher" 
        },
        "createdQuizzes": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "quizzId": { "type": "string", "pattern": "^[a-fA-F0-9]{24}$" },
                    "quizTitle": { "type": "string", "maxLength": 100 }
                },
                "required": ["quizzId", "quizTitle"]
            }
        },
        "attemptedQuizzes": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "quizzId": { "type": "string", "pattern": "^[a-fA-F0-9]{24}$" }
                },
                "required": ["quizzId"]
            }
        }
    },
}
module.exports = ajv.compile(schema);
