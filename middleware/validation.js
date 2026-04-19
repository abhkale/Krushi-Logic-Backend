const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
        const { error, value } = schema.validate(data, { abortEarly: false });
        if (error) {
            const messages = error.details.map((d) => d.message).join(', ');
            return res.status(400).json({ success: false, message: messages });
        }
        if (source === 'body') req.body = value;
        else if (source === 'query') req.query = value;
        next();
    };
};

module.exports = validate;
