import dbConnect from "../../../lib/mongodb";
import { Project } from "../../../models/Schema";

export default async function handler(req, res) {
  await dbConnect();
  const { method, query, body } = req;
  const { id } = query;

  switch (method) {
    case "GET":
      try {
        if (id) {
          const project = await Project.findById(id);
          if (!project)
            return res
              .status(404)
              .json({ success: false, message: "Project not found" });
          return res.status(200).json({ success: true, data: project });
        } else {
          const projects = await Project.find({});
          return res.status(200).json({ success: true, data: projects });
        }
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    case "POST":
      try {
        const project = await Project.create(body);
        return res.status(201).json({ success: true, data: project });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    case "PUT":
      try {
        if (!id)
          return res
            .status(400)
            .json({ success: false, message: "Project id required" });
        const updated = await Project.findByIdAndUpdate(id, body, {
          new: true,
        });
        if (!updated)
          return res
            .status(404)
            .json({ success: false, message: "Project not found" });
        return res.status(200).json({ success: true, data: updated });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    case "DELETE":
      try {
        if (!id)
          return res
            .status(400)
            .json({ success: false, message: "Project id required" });
        const deleted = await Project.findByIdAndDelete(id);
        if (!deleted)
          return res
            .status(404)
            .json({ success: false, message: "Project not found" });
        return res.status(200).json({ success: true, data: deleted });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
