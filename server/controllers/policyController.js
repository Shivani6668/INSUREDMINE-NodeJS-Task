import Policy from '../models/Policy.js';
import User from '../models/User.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const getPolicyByUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ firstname: req.params.firstname });
  if (!user) return res.status(404).json({ message: 'User not found' });

const policies = await Policy.find({ user: user._id })
  .populate('policy_category', 'category_name')
  .populate('company', 'company_name')
  .populate('user', 'firstname email dob');


  res.json(policies);
});

export const aggregatePolicy = asyncHandler(async (req, res) => {
  const aggregation = await Policy.aggregate([
    { $group: { _id: '$user', totalPolicies: { $sum: 1 } } },
    { $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
    }},
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    { $project: { user: { firstname: 1, email: 1 }, totalPolicies: 1 } }
  ]);
  res.json(aggregation);
});
