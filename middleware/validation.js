import Joi from "joi";

const querySchema = Joi.object({
    query: Joi.string().required().min(3).max(500),
    language: Joi.string().required().length(2),
    context: Joi.object({
        customerId: Joi.string(),
        accountType: Joi.string(),
        previousInteractions: Joi.array().items(Joi.string()),
    }).optional(),
});

const feedbackSchema = Joi.object({
    queryId: Joi.string().required().uuid(),
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().optional().max(1000),
});

export const validateQuery = (req, res, next) => {
    const { error } = querySchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

export const validateFeedback = (req, res, next) => {
    const { error } = feedbackSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
