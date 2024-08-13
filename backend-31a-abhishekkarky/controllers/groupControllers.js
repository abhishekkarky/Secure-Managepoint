const group = require("../model/groupModel")

const createGroup = async (req, res) => {
    console.log(req.body)
    const {name, subscribers, groupType} = req.body

    if(!name || !subscribers || !groupType) {
        return res.status(403).json({
            success: false,
            message: 'Fill all details inorder to create !!'
        })
    }

    try {
        const newGroup = new group({
            name: name,
            subscribers: subscribers,
            groupType: groupType,
            addedBy: req.user.id
        })
        await newGroup.save()

        res.status(200).json({
            success: true,
            message: 'Created successfully !!',
            group: newGroup
        })
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error");
    }
}

const getAllGroups = async (req, res) => {
    try {
        console.log(req.user);

        const listOfTags = await group.find({
            addedBy: req.user.id,
            groupType: "Tag",
        }).sort({_id: -1})

        const listOfSegments = await group.find({
            addedBy: req.user.id,
            groupType: 'Segment'
        }).sort({_id: -1})

        res.json({
            success: true,
            message: "Tags and Segments Fetched Successfully",
            tags: listOfTags,
            segments: listOfSegments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const singleGroupById = async (req, res) => {
    try {
        console.log(req.user)
        const singleGroup = await group.findById(req.params.id).populate("subscribers")
        if (!singleGroup || !singleGroup.addedBy.equals(req.user.id)) {
            res.status(403).json({
                success: false,
                message: "Permission Denied !!"
            })
        }
        res.status(200).json({
            success: true,
            message: 'Group fetched successfully',
            group: singleGroup,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
}

const updateGroupById = async (req, res) => {
    console.log(req.body)
    const id = req.params.id
    const {name, subscribers} = req.body
    console.log(name, subscribers)
    if(!name || !subscribers) {
        return res.status(403).json({
            success: false,
            message: 'Please fill all details'
        })
    }
    try {
        const updatedGroup = {
            name: name,
            subscribers: subscribers
        }
        await group.findByIdAndUpdate(id, updatedGroup)

        res.status(200).json({
            success: true,
            message: 'Updated Successfully',
            groupData: updatedGroup
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
}

const deleteGroupById = async (req, res) => {
    const id = req.params.id
    try {
        await group.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'Deleted Successfully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message : "server error"
        })
    }
}


module.exports = {
    createGroup,
    getAllGroups,
    deleteGroupById,
    updateGroupById,
    singleGroupById
}