import { Agent } from './models/agent'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  uri = 'http://0.0.0.0:5000';
  agentes: Agent[];
  agent: Agent;
  id_agent;
  constructor(private http: HttpClient) {}

  getMetric(oid: string): Observable<any> {
    this.id_agent = localStorage.getItem('snmp_agent_id');
    this.agentes = JSON.parse(localStorage.getItem('agentes_snmp'));
    this.agent = this.agentes.find(a => a.id_agent === this.id_agent);

    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    const formData: FormData = new FormData();
    formData.append('ip', this.agent.ip);
    formData.append('community_string', 'public');
    formData.append('oid', oid);
    formData.append('id_agent', this.agent.id_agent.toString());

    return this.http.post(`${this.uri}/get_snmp`, formData);
  }

  addAgent(ag: Agent): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    const formData: FormData = new FormData();
    formData.append('name', ag.name);
    formData.append('port', ag.port);

    return this.http.post(`${this.uri}/generate_instance_agent`, formData);
  }
}
