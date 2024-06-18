USE master
CREATE DATABASE ISKURSACH
ON
(NAME = 'KIS',
FILENAME = 'C:\BD\Kursach.mdf',
SIZE = 1,
MAXSIZE = 15,
FILEGROWTH = 1)
LOG ON
(NAME = 'KIS_log',
FILENAME = 'C:\BD\Kursach_log.ldf',
SIZE = 1,
MAXSIZE = 10,
FILEGROWTH = 1)
GO
USE ISKURSACH
GO

-- Creating Product table
CREATE TABLE Product(
    Id int not null identity(1, 1),
    ParentId int,
    Name varchar(50) not null,
    QuantityPerParent int not null,
    Measure varchar(50) not null,
    Calories int not null,
    CONSTRAINT PK_Product PRIMARY KEY (Id)
)
GO
-- Creating Client table
CREATE TABLE Client(
    Id int not null identity(1, 1),
    Name varchar(50) not null,
    PhoneNumber varchar(20),
    Bonus int,
    MoneySpend int,
    CONSTRAINT PK_Client PRIMARY KEY (Id)
)
GO

-- Creating Menu table
CREATE TABLE Menu(
    Id int not null identity(1, 1),
    ProductId int not null,
    Name varchar(50) not null,
    Type varchar(20),
    FullCalories int not null,
    CONSTRAINT PK_Menu PRIMARY KEY (Id)
)
GO

-- Creating Check table
CREATE TABLE Check_(
    Id int not null identity(1, 1),
    Sum int not null,
    Date date not null,
    PaymentType varchar(20) not null,
    CONSTRAINT PK_Check PRIMARY KEY (Id)
)
GO

-- Creating ItemMenu table
CREATE TABLE ItemMenu (
    ID INT PRIMARY KEY IDENTITY,
    CheckID INT FOREIGN KEY REFERENCES [Check_](ID),
    ProductID INT FOREIGN KEY REFERENCES Product(ID),
    Count INT,
    Status NVARCHAR(20) DEFAULT 'In Basket',
    CONSTRAINT PK_ItemMenu PRIMARY KEY (Id)
)
GO

-- Creating History table
CREATE TABLE History(
    Id int not null identity(1, 1),
    CheckId int not null,
    ClientId int not null,
    LastPurchase date not null,
    CONSTRAINT PK_History PRIMARY KEY (Id)
)
GO

-- Creating Order table
CREATE TABLE Order_(
    Id int not null identity(1, 1),
    Description varchar(255),
    Date date not null,
    CONSTRAINT PK_Order PRIMARY KEY (Id)
)
GO

-- Creating ItemOrder table
CREATE TABLE ItemOrder(
    Id int not null identity(1, 1),
    OrderId int not null,
    ItemMenuId int not null,
    CONSTRAINT PK_ItemOrder PRIMARY KEY (Id)
)