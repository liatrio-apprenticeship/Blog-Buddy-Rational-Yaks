from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()

class Blog(Base):
    __tablename__ = 'blogs'

    kickoff = Column(String)
    author = Column(String)
    title = Column(String, primary_key=True)
    summary = Column(String)
    target_level_1 = Column(String)
    target_func_1 = Column(String)
    target_level_2 = Column(String)
    target_func_2 = Column(String)
    liatrio_service_conn = Column(String)
    link_liatrio = Column(String)

engine = create_engine('sqlite:////working_dir/sqlite/blog.db')
Base.metadata.create_all(engine)
