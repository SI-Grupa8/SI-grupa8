using System;
namespace DAL.Interfaces
{
	public interface IRepository<TEntity> where TEntity : class
	{
        Task<TEntity?> GetById(int id);
        Task<List<TEntity>> GetAll();
        void Add(TEntity entity);
        void Update(TEntity entity);
        void Remove(TEntity entity);
        Task SaveChangesAsync();
        void DetachEntity(TEntity entity);
    }
}

