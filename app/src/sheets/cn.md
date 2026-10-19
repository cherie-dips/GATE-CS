## Layering (OSI / TCP-IP) {#concepts-of-layering}

### Layers
| OSI layer | TCP/IP | PDU | Job | Devices / protocols |
|---|---|---|---|---|
| 7 Application | Application | data / message | user services | HTTP, FTP, SMTP, DNS |
| 6 Presentation | Application | | encoding, encryption, compression | SSL/TLS (often placed here), JPEG |
| 5 Session | Application | | dialog control, sync points | RPC |
| 4 Transport | Transport | segment (TCP) / datagram (UDP) | process-to-process, ports, reliability | TCP, UDP |
| 3 Network | Internet | packet / datagram | host-to-host, routing, logical addressing | IP, ICMP, routers |
| 2 Data link | Network access | frame | hop-to-hop, MAC addresses, error detection | Ethernet, switches, bridges |
| 1 Physical | Network access | bits | signals on the medium | hubs, repeaters |
- Each layer adds a header on the way down (encapsulation); the data link layer also adds a trailer (CRC)
- End-to-end layers (4–7) run only on hosts; routers implement layers 1–3

### Collision & broadcast domains
| Device | Layer | Collision domains | Broadcast domains |
|---|---|---|---|
| Hub / repeater | 1 | one for all ports | one |
| Switch / bridge | 2 | one per port | one |
| Router | 3 | one per port | one per port |

### Units
- Data rates use powers of 10 (1 Mbps = $10^6$ bit/s); memory / file sizes usually powers of 2 (1 KB = $2^{10}$ B) — follow the question
- 1 byte = 8 bits; propagation speed ≈ $2\times10^8$ m/s in cable, $3\times10^8$ m/s in air

## Data Link Layer, Framing & Error Control {#data-link-layer-and-switching}

### Delays
- Transmission $T_t=\frac{L}{B}$ (frame bits / bandwidth); propagation $T_p=\frac{d}{v}$; RTT $=2T_p$ (+ processing / queueing)
- $a=\frac{T_p}{T_t}$; bandwidth–delay product $=B\times T_p$ bits in flight one way
- Store-and-forward over $N$ equal links, $P$ packets: $N\,T_p+(N+P-1)\,T_t$; one packet: $N(T_t+T_p)$
- Circuit switching: setup + $T_t$ + $T_p$ (no per-hop transmission)
- Virtual circuit: setup phase, packets carry a VC id and follow one path. Datagram: per-packet routing, may arrive out of order

### Flow control efficiency
| Protocol | Sender window | Receiver window | Sequence numbers ($n$ bits) |
|---|---|---|---|
| Stop-and-wait | 1 | 1 | 2 (1 bit) |
| Go-Back-N | $\le2^n-1$ | 1 | $\ge W_s+1$ |
| Selective Repeat | $\le2^{n-1}$ | $=W_s$ | $\ge2W_s$ |
- Stop-and-wait efficiency $\eta=\dfrac{T_t}{T_t+2T_p}=\dfrac1{1+2a}$ (add ACK transmission time if given)
- Sliding window: $\eta=\min\left(1,\dfrac{W}{1+2a}\right)$; full utilisation needs $W\ge1+2a$
- Throughput $=\eta\times B$
- GBN resends the lost frame and everything after it; SR resends only lost frames; GBN uses cumulative ACKs
- Stop-and-wait with error probability $p$: expected transmissions per frame $\frac1{1-p}$

### Error detection & correction
- Hamming distance $d$ of a code: detects $d-1$ errors, corrects $\lfloor\frac{d-1}2\rfloor$. Detect $s$ ⇒ $d\ge s+1$; correct $t$ ⇒ $d\ge2t+1$; both ⇒ $d\ge s+t+1$ ($s\ge t$)
- Single parity bit: detects any odd number of bit errors; 2-D parity corrects single-bit errors
- Hamming code: $r$ check bits for $m$ data bits need $2^r\ge m+r+1$; check bits at positions $1,2,4,8,\dots$
- CRC with generator of degree $r$ ($r+1$ bits): append $r$ zeros, divide modulo 2, the $r$-bit remainder is the CRC
  - Detects all single-bit errors, all bursts of length $\le r$, all odd-count errors if $(x+1)$ divides the generator
- Internet checksum: 1's-complement sum of 16-bit words, then complement

### Framing
- Bit stuffing: after five consecutive 1s insert a 0; flag 01111110 (HDLC)
- Byte (character) stuffing: escape byte before any flag/escape byte in the data
- Character count framing is fragile (one corrupted count desynchronises)

## MAC Protocols, Ethernet & Wi-Fi {#lan-technologies-and-wi-fi}

### ALOHA
| | Throughput $S$ ($G$ = frames per frame-time) | Max | At |
|---|---|---|---|
| Pure ALOHA | $Ge^{-2G}$ | $\frac1{2e}\approx18.4\%$ | $G=0.5$ |
| Slotted ALOHA | $Ge^{-G}$ | $\frac1e\approx36.8\%$ | $G=1$ |
- Vulnerable period: pure $2T_t$, slotted $T_t$
- $N$ stations each transmitting with probability $p$ in a slot: P(success) $=Np(1-p)^{N-1}$, maximised at $p=1/N$

### CSMA/CD (Ethernet)
- Collision must be detected while still sending: $T_t\ge2T_p$ ⇒ minimum frame $L_{min}=2\,T_p\,B$
- Classic Ethernet (10 Mbps): min frame 64 B (512 bit times = 51.2 µs slot), max 1518 B; payload 46–1500 B; header 14 B + CRC 4 B; preamble 7 B + SFD 1 B not counted
- Binary exponential backoff: after the $n$-th collision wait $K\times$ slot time, $K$ uniform in $\{0,\dots,2^m-1\}$, $m=\min(n,10)$; give up after 16 attempts
- MAC address 48 bits; broadcast `FF:FF:FF:FF:FF:FF`
- Persistence: 1-persistent (send as soon as idle), non-persistent (wait random time), $p$-persistent (slotted channels)
- Efficiency $\approx\dfrac1{1+6.44a}$ (common GATE form); Kurose: $\dfrac1{1+5a}$ — use the form the question implies

### Other LANs
- CSMA/CA (802.11 Wi-Fi): collisions can't be detected; uses ACKs, interframe spaces (SIFS < DIFS), optional RTS/CTS for the hidden-terminal problem
- Token ring / token bus: a token circulates; no collisions
- Switches learn MAC → port from source addresses, flood unknown destinations; spanning tree protocol removes loops

## Network Layer: IP, Addressing & Subnetting {#network-layer}

### IPv4 header (20–60 bytes)
| Field | Bits | Notes |
|---|---|---|
| Version, IHL | 4, 4 | IHL counts 4-byte words (5..15) |
| Type of service | 8 | |
| Total length | 16 | header + data, max 65535 B |
| Identification, flags, fragment offset | 16, 3, 13 | flags DF, MF; offset in 8-byte units |
| TTL | 8 | decremented each hop; dropped at 0 |
| Protocol | 8 | ICMP 1, TCP 6, UDP 17 |
| Header checksum | 16 | header only; recomputed at each router |
| Source, destination | 32, 32 | |

### Fragmentation
- Data per fragment = largest multiple of 8 ≤ MTU − IP header; every fragment except the last has MF = 1
- Offset = (byte position of the fragment's data in the original) / 8
- Fragments are reassembled only at the destination; DF = 1 with oversized packet ⇒ dropped (ICMP error)
- Number of fragments $=\lceil\text{data}/\text{data per fragment}\rceil$

### Address classes
| Class | First octet | Default mask | Hosts per network |
|---|---|---|---|
| A | 0–127 (`0` lead bit) | /8 | $2^{24}-2$ |
| B | 128–191 (`10`) | /16 | $2^{16}-2$ |
| C | 192–223 (`110`) | /24 | $2^8-2$ |
| D | 224–239 (`1110`) | multicast | — |
| E | 240–255 | reserved | — |
- Private: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`. Loopback `127.0.0.0/8`. Limited broadcast `255.255.255.255`
- Networks per class: A $2^7$ (126 usable), B $2^{14}$, C $2^{21}$

### Subnetting & CIDR
- Hosts per subnet $=2^h-2$ ($h$ host bits; all-0 = network, all-1 = broadcast); subnets from $s$ borrowed bits $=2^s$
- Network address = IP AND mask; broadcast = network OR (NOT mask)
- Mask octets: /25 = 128, /26 = 192, /27 = 224, /28 = 240, /29 = 248, /30 = 252, /31 = 254, /32 = 255
- Two hosts are on the same subnet iff (IP₁ AND mask) = (IP₂ AND mask)
- Aggregation (supernetting): blocks must be contiguous, a power of 2 in count, and aligned to the new prefix
- Forwarding: longest prefix match; default route `0.0.0.0/0`

### Supporting protocols
- ARP: IP → MAC (broadcast request, unicast reply); RARP: MAC → IP
- DHCP: Discover, Offer, Request, ACK (UDP 67 server / 68 client)
- ICMP: echo (ping), time exceeded (traceroute), destination unreachable
- NAT: many private addresses behind one public address, mapped by port
- IPv6: 128-bit addresses, fixed 40-byte header, no header checksum, fragmentation only at the source, hop limit instead of TTL

## Routing Algorithms {#routing-algorithm}

### Distance vector
- Bellman–Ford: $D_x(y)=\min_v\{c(x,v)+D_v(y)\}$; each router sends its whole vector to **neighbours** only
- Good news travels fast, bad news slowly: count-to-infinity. Split horizon / poison reverse fix two-node loops, not larger ones
- RIP: hop count, 15 max (16 = infinity), updates every 30 s, UDP 520

### Link state
- Each router floods its link costs to **all** routers; each runs Dijkstra on the full map
- Faster convergence, no count-to-infinity; more memory / CPU. OSPF (over IP directly, protocol 89)

### Inter-domain
- BGP: path vector between autonomous systems, TCP 179; RIP / OSPF are intra-domain
- Flooding: every packet sent on every link except the incoming one; use hop counts or sequence numbers to stop it

## Transport Layer: TCP, UDP & Congestion Control {#tcp-udp-sockets-and-congestion-control}

### UDP
- Header 8 bytes: source port, destination port, length, checksum
- Connectionless, unreliable, no flow / congestion control, message boundaries kept
- Used by DNS, DHCP, SNMP, TFTP, RIP, streaming, VoIP

### TCP header (20–60 bytes)
- Ports 16 + 16, sequence number 32, ACK number 32, header length 4 (4-byte words), flags (URG ACK PSH RST SYN FIN), window 16, checksum 16, urgent pointer 16
- Sequence numbers count **bytes**; ACK = next byte expected (cumulative)
- SYN and FIN each consume one sequence number
- Window field max 65535 B; window-scale option multiplies by up to $2^{14}$

### Connection management
- Open: SYN → SYN+ACK → ACK (3-way handshake); close: FIN, ACK, FIN, ACK (4 segments; FIN+ACK can be combined)
- TIME_WAIT lasts 2 MSL; initial sequence numbers are random

### Throughput & sequence numbers
- Max throughput $=\dfrac{\text{window}}{\text{RTT}}$; window needed for full utilisation $=B\times\text{RTT}$
- Wrap-around time $=\dfrac{2^{32}}{\text{bandwidth in bytes/s}}$; sequence bits needed so no wrap within lifetime: $2^n\ge B\times\text{lifetime}$ (bytes)

### Congestion control
- Effective window = min(cwnd, rwnd)
- Slow start: cwnd += 1 MSS per ACK ⇒ doubles every RTT until ssthresh
- Congestion avoidance: cwnd += 1 MSS per RTT (additive increase)
- Timeout: ssthresh = cwnd/2, cwnd = 1 MSS, back to slow start (Tahoe and Reno)
- 3 duplicate ACKs: Tahoe as timeout; Reno: ssthresh = cwnd/2, cwnd = ssthresh (fast recovery, +3 MSS in some texts), then congestion avoidance
- Trace round by round in a table: RTT number, cwnd, event

### Timers
- EstimatedRTT $=(1-\alpha)\,\text{EstRTT}+\alpha\,\text{SampleRTT}$, $\alpha=\frac18$
- DevRTT $=(1-\beta)\,\text{DevRTT}+\beta\,\lvert\text{Sample}-\text{Est}\rvert$, $\beta=\frac14$; Timeout $=\text{EstRTT}+4\,\text{DevRTT}$
- Basic (original) timeout $=2\times\text{EstRTT}$. Karn: ignore samples from retransmitted segments; double the timeout after each retransmission

### Traffic shaping
- Leaky bucket: constant output rate regardless of bursts
- Token bucket (capacity $C$, token rate $\rho$, max output rate $M$): max burst duration $S=\dfrac{C}{M-\rho}$; max data in time $t$: $C+\rho t$

### Sockets
- Server: `socket` → `bind` → `listen` → `accept` (blocks) → `recv/send` → `close`; client: `socket` → `connect` → `send/recv` → `close`
- Ports 0–1023 well-known; a TCP connection is identified by (src IP, src port, dst IP, dst port)
- Silly window syndrome: Nagle's algorithm (sender), Clark's solution (receiver)

## Application Layer Protocols {#application-layer-protocol}

### Ports & transport
| Protocol | Port | Transport |
|---|---|---|
| FTP | 20 data, 21 control | TCP |
| SSH / Telnet | 22 / 23 | TCP |
| SMTP | 25 | TCP |
| DNS | 53 | UDP (TCP for zone transfers / large replies) |
| DHCP | 67 / 68 | UDP |
| TFTP | 69 | UDP |
| HTTP / HTTPS | 80 / 443 | TCP |
| POP3 / IMAP | 110 / 143 | TCP |
| SNMP | 161 / 162 | UDP |
| BGP | 179 | TCP |

### HTTP
- Stateless (cookies add state); methods GET, POST, HEAD, PUT, DELETE
- Status: 1xx info, 2xx success (200), 3xx redirect (301, 304 not modified), 4xx client error (404), 5xx server error (500)
- Non-persistent: each object costs 2 RTT + transmission time (TCP setup + request)
- Persistent without pipelining: 1 RTT per object after the first; with pipelining: about 1 RTT for all referenced objects
- Base page + $N$ objects, non-persistent with $k$ parallel connections: $2\text{RTT}+\lceil N/k\rceil\times2\text{RTT}$

### Email & files
- SMTP pushes mail (client → server, server → server); POP3 / IMAP pull mail to the user agent; MIME for non-ASCII content
- FTP: separate control (persistent, out-of-band) and data connections (one per file); stateful

### DNS
- Hierarchy: root → TLD → authoritative; local resolver caches answers (TTL)
- Recursive query (server does the work) vs iterative (server returns a referral)
- Records: A (IPv4), AAAA (IPv6), NS, CNAME (alias), MX (mail), PTR (reverse)

## Network Security {#network-security}

### Goals & primitives
- Confidentiality (encryption), integrity (hash / MAC), authentication (MAC, signatures), non-repudiation (digital signatures only)
- Keys for $n$ users: symmetric $\binom n2=\frac{n(n-1)}2$; public-key: $n$ key pairs ($2n$ keys)

### Symmetric ciphers
| Cipher | Block | Key | Rounds |
|---|---|---|---|
| DES | 64 bits | 56 bits | 16 |
| 3DES | 64 bits | 112 / 168 bits | 48 |
| AES | 128 bits | 128 / 192 / 256 bits | 10 / 12 / 14 |
- Caesar / substitution ciphers are broken by frequency analysis

### RSA
- Choose primes $p,q$; $n=pq$; $\varphi(n)=(p-1)(q-1)$; pick $e$ with $\gcd(e,\varphi(n))=1$; $d=e^{-1}\bmod\varphi(n)$
- Public key $(e,n)$, private $(d,n)$; encrypt $C=M^e\bmod n$; decrypt $M=C^d\bmod n$

### Diffie–Hellman
- Public prime $p$ and generator $g$; A sends $g^a\bmod p$, B sends $g^b\bmod p$; shared key $g^{ab}\bmod p$
- Unauthenticated DH is open to man-in-the-middle

### Signatures & hashing
- Sign with the sender's **private** key, verify with the sender's **public** key
- Confidentiality: encrypt with the receiver's **public** key. Both: sign with own private key, then encrypt with receiver's public key
- Hashes: MD5 128-bit, SHA-1 160-bit, SHA-256 256-bit; HMAC = hash with a shared key (integrity + authentication, no non-repudiation)
- Certificate: a CA signs (identity, public key) with the CA's private key

### Protocols & firewalls
- IPsec (network layer; AH, ESP; transport / tunnel mode), TLS/SSL (between transport and application), PGP (email)
- Firewalls: packet filter (L3/L4 headers), stateful inspection, application gateway / proxy (L7)
