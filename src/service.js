import { fetchWithAuth } from "./api/fetchWithAuth";
import { config } from "./config";

// Fetch agent data by id
export async function getAgentById(id, token) {
  const res = await fetchWithAuth(
    `https://${config.HOST}:${config.PORT}/api/v1/tenant/agents/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch agent data");
  return res.json();
}

// Update agent data by id
export async function updateAgentById(id, data, token) {
  const res = await fetchWithAuth(
    `https://${config.HOST}:${config.PORT}/api/v1/tenant/agents/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error("Failed to update agent");
  return res.json();
}

// Delete agent by id
export async function deleteAgentById(id, token) {
  const res = await fetchWithAuth(
    `https://${config.HOST}:${config.PORT}/api/v1/tenant/agents/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  if (!res.ok) throw new Error("Failed to delete agent");
  return true;
}

// Fetch all agents
export async function getAgents(token) {
  const res = await fetchWithAuth(
    `https://${config.HOST}:${config.PORT}/api/v1/tenant/agents?limit=10&offset=0`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch agents");
  return res.json();
}

// Create a new agent
export async function createAgent(data, token) {
  const res = await fetchWithAuth(
    `https://${config.HOST}:${config.PORT}/api/v1/tenant/agents`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) {
    let msg = "Failed to create agent";
    try {
      const errData = await res.json();
      msg = errData.message || JSON.stringify(errData);
    } catch {
      // Ignore JSON parsing error
      // Use the default message
    }
    throw new Error(msg);
  }
  return res.json();
}

// Get agent roles
export async function getRoles(token) {
  const res = await fetchWithAuth(
    `https://${config.HOST}:${config.PORT}/api/v1/tenant/agents/roles`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch roles");
  return res.json();
}
