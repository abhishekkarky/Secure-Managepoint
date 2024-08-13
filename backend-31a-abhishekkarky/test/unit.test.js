const request = require("supertest");
const app = require("../index");

describe("Api testing", () => {
  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZGRhMzBmNzQzNDdlMTgyNDI0NzBlMSIsImlhdCI6MTcwOTM5NDE2MX0.zRmIpl79WHMWmm5biQ-eEnquB6sq6OHsGsMzdLyyqWs";

  it("POST/api/user/login | Response with valid json", async () => {
    const response = await request(app).post("/api/user/login").send({
      email: "abhishekkarki40@gmail.com",
      password: "abhishek",
    });
    console.log(response.body);
    if (response.body.success) {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Welcome");
      expect(response.body.token).toBeDefined();
    }
  });

  it("POST/api/user/create | Response with valid json", async () => {
    const response = await request(app).post("/api/user/create").send({
      fullName: "test",
      email: "test@gmail.com",
      password: "test12345",
    });
    console.log(response.body);
    if (response.body.success) {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User created successfully");
    } else {
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User already exists");
    }
  });

  it("POST/api/subscriber/add | Response with valid json", async () => {
    const response = await request(app)
      .post("/api/subscriber/add")
      .send({
        fullName: "test",
        email: "test@gmail.com",
      })
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);
    if (response.body.success) {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Subscriber added successfully");
    } else {
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Please fill all the fields.");
    }
  });

  it("POST/api/broadcast/create | Response with valid json", async () => {
    const response = await request(app)
      .post("/api/broadcast/create")
      .send({
        broadcastTitle: "test",
        broadcastTo: "test@gmail.com",
        broadcastTime: "2024-03-01",
        broadcastDescription: "hello hello",
        addedBy: "65dda30f74347e18242470e1",
        sendTo: [""],
      })
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);
    if (response.body.success) {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Broadcast successful !!");
    } else {
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Please fill all the fields.");
    }
  });

  it("POST/api/group/add | Response with valid json", async () => {
    const response = await request(app)
      .post("/api/group/add")
      .send({
        name: "test",
        subscribers: ["65e1a75c45c0620bdd51ed6c"],
        groupType: "Tag",
        addedBy: "65dda30f74347e18242470e1",
      })
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);
    if (response.body.success) {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Created successfully !!");
    } else {
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Please fill all the fields.");
    }
  });

  it("GET/api/subscriber/all | Response with valid json", async () => {
    const response = await request(app)
      .get("/api/subscriber/all")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Subscribers successfully fetched");
  });

  it("GET/api/broadcast/all | Response with valid json", async () => {
    const response = await request(app)
      .get("/api/broadcast/all")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Fetched successfully");
  });

  it("GET Group | fetch group", async () => {
    const response = await request(app)
      .get("/api/group/all")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Tags and Segments Fetched Successfully"
    );
  });

  it("GET Subscriber | fetch subscriber count", async () => {
    const response = await request(app)
      .get("/api/subscriber/count")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Total subscriber count fetched successfully"
    );
  });

  it("GET Broadcast | fetch broadcast count", async () => {
    const response = await request(app)
      .get("/api/broadcast/count")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Total broadcast count fetched successfully"
    );
  });

  it("GET User | fetch user by id", async () => {
    const response = await request(app)
      .get("/api/user/getUser/65dda30f74347e18242470e1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User Details fetched successfully");
  });
});
