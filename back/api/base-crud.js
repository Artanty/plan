// Base CRUD class with API functions
class BaseCRUD {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async create(data) {
    const sql = `INSERT INTO ${this.tableName} SET ?`;
    const result = await db.query(sql, data);
    return result;
  }

  async read(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const [record] = await db.query(sql, [id]);
    return record;
  }

  async update(id, data) {
    const sql = `UPDATE ${this.tableName} SET ? WHERE id = ?`;
    const result = await db.query(sql, [data, id]);
    return result;
  }

  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await db.query(sql, [id]);
    return result;
  }

  // API functions
  createAPI(req, res) {
    this.create(req.body)
      .then(result => res.status(201).json({ message: 'Record created successfully', id: result.insertId }))
      .catch(error => res.status(500).json({ message: 'Error creating record', error }));
  }

  readAPI(req, res) {
    this.read(req.params.id)
      .then(record => record ? res.json(record) : res.status(404).json({ message: 'Record not found' }))
      .catch(error => res.status(500).json({ message: 'Error retrieving record', error }));
  }

  updateAPI(req, res) {
    this.update(req.params.id, req.body)
      .then(result => result.affectedRows === 0 ? res.status(404).json({ message: 'Record not found' }) : res.json({ message: 'Record updated successfully' }))
      .catch(error => res.status(500).json({ message: 'Error updating record', error }));
  }

  deleteAPI(req, res) {
    this.delete(req.params.id)
      .then(result => result.affectedRows === 0 ? res.status(404).json({ message: 'Record not found' }) : res.json({ message: 'Record deleted successfully' }))
      .catch(error => res.status(500).json({ message: 'Error deleting record', error }));
  }
}

module.exports = BaseCRUD;