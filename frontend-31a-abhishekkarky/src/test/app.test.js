import axios from "axios";
import add_group_mock from "../../mock/add_group_mock";
import all_broadcast_mock from "../../mock/all_broadcast_mock";
import all_subscriber_mock from "../../mock/all_subscriber_mock";
import create_broadcast_mock from "../../mock/create_broadcast_mock";
import get_broadcast_by_id from "../../mock/get_broadcast_by_id_mock";
import get_subscriber_by_id from "../../mock/get_subscriber_by_id_mock";
import login_mock from "../../mock/login_mock";
import register_mock from "../../mock/register_mock";
import get_user_by_id from "../../mock/user_by_id_mock";
import add_subscriber_mock from "../../mock/add_subscriber_mock";

const baseURL = "http://localhost:5500";
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZGRhMzBmNzQzNDdlMTgyNDI0NzBlMSIsImlhdCI6MTcwOTM5NDE2MX0.zRmIpl79WHMWmm5biQ-eEnquB6sq6OHsGsMzdLyyqWs";

describe("Frontend Testing", () => {
  
  it("Login", async () => {
    const response = await axios.post(`${baseURL}/api/user/login`, login_mock);
    expect(response.status).toEqual(200);
    expect(response.data.success).toEqual(true);
  });

  it("Register", async () => {
    const response = await axios.post(
      `${baseURL}/api/user/create`,
      register_mock
    );
    expect(response.status).toEqual(200);
    expect(response.data.success).toEqual(true);
  });

  it("Add Subscriber", async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(`${baseURL}/api/subscriber/add`, add_subscriber_mock, config);
    expect(response.status).toEqual(200);
    expect(response.data.success).toEqual(true);
  });

  it("Create Broadcast", async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `${baseURL}/api/broadcast/create`,
      create_broadcast_mock,
      config
    );
    expect(response.status).toEqual(200);
    expect(response.data.success).toEqual(true);
  });

  it("Create Group", async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `${baseURL}/api/group/add`,
      add_group_mock,
      config
    );
    expect(response.status).toEqual(200);
    expect(response.data.success).toEqual(true);
  });

  it("Fetch all subscribers", async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${baseURL}/api/subcriber/all`, config);
    expect(response.data.subscribers).toBeDefined();

    response.data.subscribers.forEach((individualSubscriber, index) => {
      expect(individualSubscriber.fullName).toEqual(
        all_subscriber_mock[index].fullName
      );
    });
  });

  it("Fetch all broadcast", async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${baseURL}/api/broadcast/all`, config);
    expect(response.data.sent).toBeDefined();

    response.data.sent.forEach((individualbroadcast, index) => {
      expect(individualbroadcast.broadcastTitle).toEqual(
        all_broadcast_mock[index].broadcastTitle
      );
    });
  });

  it("Fetch user by id", async () => {
    const response = await axios.get(
      `${baseURL}/api/user/getUser/65dda30f74347e18242470e1`
    );
    expect(response.data.userDetail).toBeDefined();
    expect(response.data.userDetail.fullName).toEqual(get_user_by_id.fullName);
  });

  it("Fetch subscriber by id", async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `${baseURL}/api/subscriber/get/65e3583c2dcb569e3f974303`,
      config
    );
    expect(response.data.subscriberData).toBeDefined();
    expect(response.data.subscriberData.fullName).toEqual(
      get_subscriber_by_id.fullName
    );
  });

  it("Fetch broadcast by id", async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `${baseURL}/api/broadcast/get/65e027e395dad0d8bf5180e1`,
      config
    );
    expect(response.data.broadcastData).toBeDefined();
    expect(response.data.broadcastData.broadcastTitle).toEqual(
      get_broadcast_by_id.broadcastTitle
    );
  });
});
