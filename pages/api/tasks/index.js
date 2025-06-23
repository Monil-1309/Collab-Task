import dbConnect from "../../../lib/mongodb";
import { Task } from "../../../models/Schema";

export default async function handler(req, res) {
  await dbConnect();
  const { method, query, body } = req;
  const { id } = query;

  switch (method) {
    case "GET":
      try {
        if (id) {
          const task = await Task.findById(id);
          if (!task)
            return res
              .status(404)
              .json({ success: false, message: "Task not found" });
          return res.status(200).json({ success: true, data: task });
        } else {
          const tasks = await Task.find({});
          return res.status(200).json({ success: true, data: tasks });
        }
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    case "POST":
      try {
        const task = await Task.create(body);
        return res.status(201).json({ success: true, data: task });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    case "PUT":
      try {
        if (!id)
          return res
            .status(400)
            .json({ success: false, message: "Task id required" });
        const updated = await Task.findByIdAndUpdate(id, body, { new: true });
        if (!updated)
          return res
            .status(404)
            .json({ success: false, message: "Task not found" });
        return res.status(200).json({ success: true, data: updated });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    case "DELETE":
      try {
        if (!id)
          return res
            .status(400)
            .json({ success: false, message: "Task id required" });
        const deleted = await Task.findByIdAndDelete(id);
        if (!deleted)
          return res
            .status(404)
            .json({ success: false, message: "Task not found" });
        return res.status(200).json({ success: true, data: deleted });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
