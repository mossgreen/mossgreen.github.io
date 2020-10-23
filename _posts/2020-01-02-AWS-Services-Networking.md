---
title: AWS Servcies - Networking &CDN
search: true
tags:
  - AWS
  - SAA Certificatin
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---
VPC, CloudFront, Route 53, ALB, etc.

## Amazon Virtual Private Cloud, VPC

### Sever Layer OSI Model

It provides a good overview of how networking works at all levels of abstraction. Each layer uses the layers below and adds additional capabilities. Data between two devices moves down the stack at the A side (and wrapped at each layer) ... is transmitted .. before moving up the stack at the B side (and the wrapping stripped at each stage). This process is called encapsulation.

1. L1, uses a shared medium Hardware can transmit and listen. The layer 1 standard agrees how to transmit and recieve. The medium, the voltages, the RF details
2. L2, Data Link, addes MAC Address which can be used for named communication between two devices on a local network. Additionally L2 adds controls over the media, avoiding cross-talk and allows for backoff and retransmission. L2 communications use L1 to broadcast and listen. Le runs on top of L1.
3. L3, The Network layer, allows for unique devide to device communication over interconnected networks. L3 devices can pass packets over 10's or even 100's of L2 networks. The packets remain largely unchanged during this journey -travelling within different L2 frames as they passover different networks.
   - A client Machine Generates a l3 Packet with its IP as the sourceIP and the destinationIP of the server.
   - The packet is encapsulated and un-encapsulated in a l2 frame at each step, passing between routers, orver networks.
   - The original packet is received by the server, acted on, and a reply sent back in the same way.
   - L3 allows for an IP to communicate with another IP - but only a single stream, so one conversation between the two
4. L4, Transport adds TCP and UDP.
   - Tcp is desinged for reliable transport. It uses segments to ensure data is recieved in the correct order, adds error checking and ports allowing different streams of communicatins to the same host, e.g., tcp/22 and tcp/80
   - UDP is aimed at speed.
5. L5, Session adds the concept of sessions, so that request and reply communication streams are viewed as a single session of communication between client and server
6. L6, Presentation adds data conversion, envryption, compression and standards which L7 can use.
7. L7, Application is where protocols such as HTTP, SSH, FTP are added. E.g., HTTP (L7) running over TLS (L6) is HTTPS.

### IP V4 Address

IPv4 addressess are how to devices can communicate at layer 4 and above of the OSI 7-layer model. IP Address are actually 32-bit binary values.. but are represented in dotted-decimal notation to make them easier for humans to read and understand.

IPs (IP Address) are split into a Network part and a Node or Host Part. The netmask (e.g., 255.255.255.0) or prefix (e.g., /24) shows where this split occurs.

Within the IPv4 address space (0.0.0.0 to 255.255.255.255) there are certain addrewsses which are reserved, or special in some way:

- 0.0.0.0&0.0.0.0/0: represents all IP Addresses
- 255.255.255.255: IP Address used to broadcast to all IP addresses everywhere ( this is generally filtered and not passed betweeen networks)
- 127.0.0.1: localhost. Whatever the IP address of the device you're using, it can be referenced by itself as 127.0.0.1. So a local web server can be found with 127.0.0.1:80
- 169.254.0.1 to 169.254.255.254: A range of IP addresses which a device can auto confiture with if its using DHCP and fails to automatically get an IP from a DHCP server.

Historically IP Addresses were split into classes: (including)

1. Class A (/8): 1.0.0.0 to 126.255.255.255. 126 Net works, 16,777,217 Nodes in each.
2. Class B (/16): 128.0.0.0.0 to 191.255.255.255. 16,382 Networks, 65,534 Nodes in each.
3. Class C (/24): 192.0.0.0 to 233.255.255.255. 2,097,150 networks, 254 Nodes in each.

Class A networks were initially allocated to large organisations. Class B to medium and Class C to small businesses. As the supply of IPv4 addresses became low, the class system of IPs were related with CIDR.

IP Classes have a number of ranges within then used for private networking only:

- 10.0.0.0 to 10.255.255.255 private networking within the Class A range.
- 172.16.0.0 to 172.31.255.255 private networking within the Class B range 916 class B networks)
- 192.168.0.0 to 192.168.255.255 private networking within the Class C range 9256 Class C networks)
  There ranges are often used on private business networks, cloud networks and home networks.

**CIDR**, Classless Inter-Domain Routing is used for IPv4 IP Networking rather than the Class system. It allows more effective allocation and sub networking.

Either you are allocated a network range to use, or you decided on it. It will be represented as network/prefix, e.g., 10.0.0.0/16.

The network address is your starting point. The prefix is the number of bits the network uses, the remaining bits, the node part is yours to use. The node (or host) partis yours from all 0's to all 1's.

### Subnetting

Subnetting is the process of breaking a network down into smaller sub-networks. You might be allocated a public range for your business, or decided on a privte range for a VPC. Subnetting allows you to break it into smaller allocations for use in smaller networks, e.g., VPC subnets.

If you pick 10.0.0.0/16 for your VPC. It's a single network from 10.0.0.0 to 10.0.255.255 and offers 65,536 addresses. That VPC could have a single subnet within it also 10.0.0.0/16.

With a certain size of VPC, increasing the prefix creates 2 smaller sized networks. Increasing again, creates 4 even smaller networks. Increasing again creates 8 even smaller and so on.

For instance:

10.0.0.0/60 - 10.0.0.0/17 - 10.0.0.0/18 - 10.0.64.0/18 - 10.0.128.0/17 `<-- 128 = 256/2 - 10.0.128.0/18 - 10.0.192.0/18`

### IP Routering

Local device-to-device communication takes place using L1 (phycial) and L2 (Datalink) using Mac Addresses and Physical 0's and 1's. This doesn't scale across LANs and so a methid of network-to-network transit is needed. Here comes IP Routing.
IP routing is the process required to get a layer 3 packet from source to destination. It uses a series of layer 2 hops between routers to create a single layer 3 path. The method used depends on if the two devices are local, in a known remote network or and an unknown network.

Local network communication
Known remote network
Unknown remote network

Local network communication

IP-to-IP communications which occurs locally doesn't use a router. ARP is used to find the mac address for the destination IP address. The IP packet is created at L3, passed to L2 where its encapsulated inside an ethernet (L2) frame. The frame is sent to the destination MAC address. Once recieved that L2 frame is removed and the IP packet passed to L3.

Known remote network

If Instance A wants to communicate with instance B, it can use it's IP and subnet mask to determin if B is local. If its not, the following process occurs:

1. A generates a L3 packets, the SRC is the IP A, the DST si the IP B
2. A knows its default gateway (Router) IP, so it used ARP to fidn the Rotuer MAC.
3. A passes the L3 packet to the L2, wraps it in a L2 frame and sends this to the R-MAC address (not the mac address of B)
4. R recieves this, strips away the layer 2 Frame, and checks the DST IP.
5. It knows the network of IP B because its connected to it.
6. R uses ARP to find the MAC of B, generates a frame to B, puts the unaltered IP packet inside and sends to MAC B.
7. B recieves the frame, strips it away and passes the packet to L3.
   At scale, unchagned packets being passed around from router to router, each time usign a new L2 conenction.

### Firewall

A firewall is a device which historically sits at the border between differenct networks, and monitors traffic flowing between them. A firewall is capable of reading packet data and either allowing of denying traffic based on that data.

Firewall establish a barrier between networks of differenct security levels and historically have been the first line of defence against perimeter attacks.

Waht data a firewall can read and act on depends on the OSI Layer the firewall operates at:

- Layer 3, Network: source/destination IP address or ranges
- Layer 4, Transport: Protocal (TCP/UDP) & port nubmers
- Layer 5, Session: As Layer 4, but understand response traffic
- Layer 7, application: Application specifics, e.g., HTMl paths, images

### Amazon VPC basic

- a custom-defined virtual network within the AWS Cloud.
- Amazon VPC lets organizations provision a logically isolated section of the AWS Cloud where they can launch AWS resources in a virtual network that they define.
  It's the networking layer for Amazon EC2, and it allows you to build your own virtual network within AWS.
- A private network within AWS. It's your private data center inside the AWS platform.
- Can be configured to be public/private or a mixture
- Regional (**Cannot span regions**), highly available (span all AZs), and can be connected to your data center and corporate networks
- Isolated from other VPCs by default
- VPC and subnet: max `/16` (65,536 IPs) and minimum `/28` (16 Ips) (**Recommanded: `/24`**)
- VPC subnets **cannot span AZs**, in order to archive high availablility, we need to deploy app to multi AZs
- Certain IPs are reserved in subnets
- Region vs AZs vs Subnets
  ![image](https://user-images.githubusercontent.com/8748075/96802785-11567d80-1467-11eb-8b76-b745c00e78f4.png)

- Some Services are not in VPCs, e.g., DynamoDB, S3
  ![image](https://user-images.githubusercontent.com/8748075/96802496-72ca1c80-1466-11eb-9bee-a5ca046745e9.png)

Region default VPC:

- Requried for some servcies, used as default for most
- Pre-configured with all required networking/security
- A /20 public subnet in each AZ, allocating a public IP by default
- Attached internet gateway with a "main" route table sending all IPv4 traffic to the internet gateway using a 0.0.0.0/0 route
- A default DHCP option set attached
- SG: default - all from itself, all outbound
- NACL: Default - allow all inbound and outbound

Custom VPC:

- Can be desined an configured in any valid way
- You need to allocate IP ranges, create subnets, and provision gateways and networking, as well as design and implement security
- When you need multiple tiers or a more complex set of networking
- Best practice is to not use default for most production things

VPC Routing:

- Every VPC has a virtual routing device called the VPC router
- It has an iterface in any VPC subnet known as the "subnet + 1" address, for 10.0.1.0/24, this would be 10.0.1.1/32
- The router is highly available, scalable, and controls data entering and leaving the VPC and its subnets.
- Each VPC has a "main" route table, which is allocated to all subnets in the VPC by default. A subnet must have one route table.
- Additional "custom" route tables can be created and associated with subnets, but only one route table (RT) per subnet.
- A route table controls what the VPC router does with traffic leaving a subnet.
- An internet gateway is created and attached to a VPC (1:1). It can route traffic for public IPs to and from the internet.

Routes:

- A RT is a colelction of routers that are used when traffic from a subnet arrives at the VPC router.
- Every route table has a local route, which matches the CIDR of the VPC and lets traffic be routed between subnets.
- A route cotnians a destination and a target. Traffic is forwared to the target if its destination matches the route destination.
- If nultiple routes apply, the most specific is chosen. A /32 is chose before a /24, before a /16.
- Default routes (0.0.0.0/0 v4 and ::/0 v6) can be added that match any traffic not already matched.
- Targets can be IPs or AWS networking gateways/objects
- A subnet is a public subnet if it's
- configured to allocate public IPs
- if the VPC has an associated internet gateway
- if that subnet has a default route to that internet gateway. Config SG.

### Amazon VPC design best practice

![image](https://user-images.githubusercontent.com/8748075/96804890-c3dd0f00-146c-11eb-95ac-b3fb2580c480.png)

1. Create an EIP
2. Create public and private subnets, in AZ 01
3. Create public and private subnets, in AZ 02
4. Create an EC2 isntance in AZ01, private subnet.
    You won't be able to ping this instance in your local machine, even if it has got a public IP.
5. Create an EC2 isntance in AZ02, public subnet. Auto-assign public IP.
    You're able to ping this instance because it's in a public subnet.

![image](https://user-images.githubusercontent.com/8748075/96804414-6c8a6f00-146b-11eb-9b98-bb6673ec63ba.png)

![image](https://user-images.githubusercontent.com/8748075/96807896-2d145080-1474-11eb-9075-a4e24065323e.png)

### Amazon VPC components

- **Subnet**: A subnet is a range of IP addresses in your VPC, where you can place groups of isolated resources
- **Internet Gateway**: The Amazon VPC side of a connection to the public internet.
- **NAT Gateway**: a highly available, managed **Network Address Traslation (NAT)** servcie for your resource in a private subnet to access the internet.
- **Virtual private gateway**: The Amazon VPC side of a VPN connection.
- **Peering Conenction**: A peering connection enables you to route traffic via private IP address between two peered VPCs.
- **VPC Endpoints**: Enables private connectivity to services hosted in AWS, from within your CPC without using an Internet Gateway, VPN, NAT devices, or firewall proxies.
- **Egress-only Internet Gateway**: A stateful gatewy to provide egress only access for IPv6 traffic from the VPC to the internet.

![image](https://user-images.githubusercontent.com/8748075/96803081-c852f900-1467-11eb-89e2-d46984418d75.png)

### Bastion Hosts, or Jumpboxes

- A host that sits at the perimeter of a VPC
- It functions as an entry point to the VPC for trusted admins.
- Allows for updates or configuration tweaks remotely while allowing the VPC to stay private and protected
- Generally connected to via SSH or RDP
- Bastion hosts must be kept updated, and security hardened and audited regularly
- Multifactor authentication, ID federation, and/or IP blocks.

![image](https://user-images.githubusercontent.com/8748075/96804708-431e1300-146c-11eb-989e-1bf4d1560917.png)

### Network address translation, NAT

You can use a NAT device to enable instances in a private subnet to connect to the internet (for example, for software updates) or other AWS services, but prevent the internet from initiating connections with the instances.

![image](https://user-images.githubusercontent.com/8748075/96803708-84f98a00-1469-11eb-929f-c226c2589f6d.png)

Redirect process:

1. When traffic goes to the internet, the source IPv4 address is replaced with the NAT device’s address
2. when the response traffic goes to those instances, the NAT device translates the address back to those instances’ private IPv4 addresses.

Two types of NAT devices:

1. NAT instance: It's a customer-managed instances.
2. **NAT getway (recommend)**: an AWS-managed service, better availability and bandwidth

Static VS dynamic NAT

- Static NAT: A private IP is mapped to a public IP (what IGWs do). the process of 1:1 translation where an internet gateway converts a private address to a public IP address.
- Dynamic NAT: A range of private addresses are mapped onto one or more public (used by your home router and NAT gateways). Dynamic NAT is a variation that allows many private IP addresses to get outgoing internet access using a smaller number of public IPs (generally one). Dynamic NAT is provided within AWS using a NAT gateway that allows private subnets in an AWS VPC to access the internet.

NAT High Availability

If you have resources in multiple Availability Zones and they share one NAT gateway, in the event that the NAT gateway’s Availability Zone is down, resources in the other Availability Zones lose internet access.

To create an Availability Zone-independent architecture, create a NAT gateway in each Availability Zone and configure your routing to ensure that resources use the NAT gateway in the same Availability Zone.

Best practice when sending traffic to Amazon S3 or DynamoDB in the same Region

- To avoid data processing charges for NAT gateways when accessing Amazon S3 and DynamoDB that are in the same Region, set up a gateway endpoint and route the traffic through the gateway endpoint instead of the NAT gateway.
- There are no charges for using a gateway endpoint.

### Security Group, SG

It's a virtual stateful firewall that controls inbound and outbound traffic to Amazon EC2 instances (**EC2 level**).
You can specify allow rules, but not deny rules. This is an important difference between security groups and ACLs.
You need to config it for: EC2, ECS, ELB, RDS, etc..

Default security group:

- allows communication between all resources within the security group,
- allows all outbound traffic, and
- no inbound traffic is allowed until you add inbound rules to the security group.
- denies all other traffic.

### Network Access Control List, NACLs

It's another layer of security that acts as a stateless firewall on a **subnet level** (higer than instance level).

- NACLs operate at layer 4 of the OSI model (TCP/UDP and below).
- A subnet has to be associated with a NACL - either the VPC default or a custom NACL
- NACLs only impact traffic crossing the boundary of a subnet.
- NACLs are collections of rules that can explicitly **allow** or **deny** traffic based on its protocaol, port range, and source/destination
- Rules are processed in number order, lowest first. When a match is found, that action is taken and processing stops.
- The `*` rule is processed last and is an implicit deny.
- NACLs have two sets of rules: **inbound** and **outbound**.

Security Group VS. ACLS

| Security Group                                                             | Network ACLs                                                                                                                                                             |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Operates at the instance level (first layer of defense)                    | Operates at the subnet level (second layer of defense)                                                                                                                   |
| Supports allow rules only                                                  | Supports allow rules and deny rules                                                                                                                                      |
| Stateful: Return traffic is automatically allowed, regardless of any rules | Stateless: Return traffic must be explicitly allowed by rules.                                                                                                           |
| AWS evaluates all rules before deciding whether to allow traffic           | AWS processes rules in number order when deciding whether to allow traffic.                                                                                              |
| Applied selectively to individual instances                                | Automatically applied to all instances in the associated subnets; this is a backup layer of defense, so you don’t have to rely on someone specifying the security group. |

Ephemeral Ports:

- When a client initiates communications with a server, its to a well-known port number (e.g., tcp/443) on that server.
- The response is from that well-known port to an ephemeral port on the client. The client decides the port.
- NACLs are stateless, they have to consider both initiating and response traffic - state is a session-layer concept.

A use case:

Q: [I host a website on an EC2 instance. How do I allow my users to connect on HTTP (80) or HTTPS (443)?](https://aws.amazon.com/premiumsupport/knowledge-center/connect-http-https-ec2/)

Answer:

1. Security group rules
    - in bound:
      - For HTTP traffic, add an inbound rule on port 80 from the source address 0.0.0.0/0.
      - For HTTPS traffic, add an inbound rule on port 443 from the source address 0.0.0.0/0.
      - To allow IPv6 traffic, add inbound rules on the same ports from the source address ::/0
    - Out bound:
      - security groups are stateful, the return traffic from the instance to users is allowed automatically, so you don't need to modify the security group's outbound rules.
2. Network ACL
    - The default network ACL allows all inbound and outbound traffic.
    - Network ACLs are stateless, so add both inbound and outbound rules to enable the connection to your website.
    - explicitly allow traffic on port 80 and 443

NB: If the website owner or administrator wants to access other websites from the EC2 instance:

1. Network ACL outbound rules allowing traffic on port 80 or port 443 to the destination IP address
2. Network ACL inbound rules allowing traffic on ephemeral ports (1024-65535)
3. Security group rules allowing outbound traffic

### VPC Subnets

It's a segment of an Amazon VPC's IP address range where you can place groups of isolated resources.
Subnets are defined by CIDR blocks, are cotnained within an Availability zone.
The smallest subnet that you can create is a /28 (16 IP addresses).
All subnets are inside of AZs. To achive high available, you need to deploy your app into at lease 2 AZs.

Can be public, private or VPN-only.

1. public subnets: the associated route table directs the subnet's traffic to the amazon VPC's **IGW**. (goes to the public)
2. private subnets: the associated route table **doesn't** direct the subnet's traffic to the Amazon VPC's IGW
3. VPN-only: the associated route table directs the subnet's traffic to the Amazon VPC's VPG and doesn't have a route to the IGW.

### Rotue table

- A logical construct within an Amazon VPC that contians a set of rules (called routes)that are applied to the subnet and used to determine where network traffic is directed.
- You can use route tables to specify which subnets are public, which are private.
- The router also enables subnets, IGWs and VPGs to communicate with each other.

### IGW, Internet Gateways

It's horizontally scaled, redundant and highly available Amazon VPC component that allows communication between instances in your Amazon VPC and the Internet.

An IGW provides a target in your Amazon VPC route tables for Internet-routeable traffic, and **it performs network address translation** for instances that have been assigned public IP address.

You may only have **one IGW for each Amazon VPC**.

To create a public subnet with Internet access:

1. Attache an IGW to your Amazon VPC
2. Create a subnet route table rule to send all non-local traffic(0.0.0.0/0) to the IGW
3. Configure your network ACLs and security group rules to allow relevant traffic to flow to and from your instance

To enable an Amazon EC2 instance to send and receive traffic from the Internet:

- Assign a public IP address or EIP address

### DHCP, Dynamic Host Configuration Protocol

Allows ytou to direct Amazon EC2 host name assignment to your own resources.

A DHCP **option set** allows customers to

- define DNS servers for DNS name resolution,
- establish domain names for instances within an Amazon VPC,
- define NTP servers,
- and define the NetBIOS name servers.

### EIP, Elastic IP Addresses

The private IPs of an EC2 instances cannot be modified after creation.
The public IPs of an EC2 instances get lost after restarting.
EIP is a static, public IP address in the pool for the region that you can allocate to your account and release.

It allows you to maintain a set of IP addresses that remain fixed while the underlying infrastructure may change over time.

### VPC Endpoints

Key words:

- isolation
- never leave the AWS network

VPC Endpoints are gateway objects created within a VPC. They can be used to connect to AWS public services without the need for the VPC to have an attached internet gateway and be public.

Two types of VPC endpoints:

- Gateway endpoints: Can be used for **DynamoDB** and **S3**
- Interface endpoints:
  - can be used for everything else (e.g., SNS, SQS)
  - AWS PrivateLink

When to use a VPC Endpoint:

- If the entire VPC is private eith no IGW
- If a specific instance has no public IP/NATGW and needs to access public services
- To access resources restricted to specific VPCs or endpoints (private S3 bucket)

![image](https://user-images.githubusercontent.com/8748075/96805596-7d88af80-146e-11eb-819b-8c0ce234b78d.png)

Limitations and Considerations

- Gateway endpoints are used via route table entries - they're gateway devices. Prefix lists for a service are used in the destination field with the gateway as the target.
- Gateway endpoints can be restricted via policies.
- Gateway endpoints are HA across AZs in a region.
- Interface endpoints are interfaces in a specific subnet. for HA, you need to add multiple interfaces - one per AZ.
- Interface endpoitns are controlled via SGs on that interface. NACLs also impact traffic.
- Interface endpoints and replace the DNS for the service - no route table updates are requried.
- Code chagnes to use the endpoint DNS, or enable private DNS to override the default service DNS.

### VPC peering

VPC peering is a feature that allows isolated VPCs to be connected at layer 3. VPC peering uses a peering connection, which is a gateway object linking two VPCs.

- Allows direct communication between VPCs.
- Services can communicate using private IPs from VPC to VPC.
- VPC peers can **span AWS accounts** and **even regions** (with limitations)
- Dat is encrypted and transits via the AWS global backbone.
- VPC peers are used to link two VPCs at layer3: company mergers, shared servcies, companyand vendor, auditing

![image](https://user-images.githubusercontent.com/8748075/96805836-04d62300-146f-11eb-92a1-5fcead9ebcda.png)

Important Limits and considerations

- VPC CIDR blocks cannot overlap
- VPC peers connect two VPCs - routing is not ransitive
- Routes are required at both sides (remote CIDR -> peer connection)
- NACLs and SGs can be used to control access
- SGs can be referenced but not cross-region
- IPv6 support is not available cross-region.
- DNS resolution to private IPs can be enabled, but it's a setting needed at both sides.

### VPG & CGW

- A VPG is the Amazon side of a VPN connection.
- A CGW is the customer side of a VPN connection
- The VPN connection must be initiated from the CGW side, and the connection consists of two IPSec tunnels.
- IPsec is the security protocol supported by Amazon VPC.

### IPv6

IPv6 is the next generation of IP available within AWS. It's not fully supported across all AWS services, and it isn't enabled by default.

IPv6 VPC Setup:

- It's currently opt-in - it's desabled by default
- To use it, the first step is to request an IPv6 allocatin. Each VPC is allocated a `/56` CIDR from the AWS pool - this cannot be adjusted.
- Within the VPC IPv6 range allocated, subnets can be allocated a `/64` CIDR from within the `/56` range
- Resources launched into a subnet with an IPv6 range can be allocated a IPv6 address via DHCP6.

Limitations and Considerations:

- DNS names are not allocated to IPv6 addresses.
- IPv6 addresses are all public routable - there is no concept of private vs. public wiht IPv6 (unlike IPv4 addresses)
- With IPv6, the OS is confired with this public address via DHCP6.
- Elastic IPs aren't relevant with IPv6.
- Not currently supported for VPCs, customer gateways and VPC endpoints.

### IPv6 Egress-Only Gateway

Egress-only internet gateways provide **outgoing-only** (and response) access for an IPv6-enabled VPC resource.

NAT gateways provide two functions for IPv4 resources:

1. Sharing a single public IP address for private resources
2. Outgoing-only access

NAT as a process isn't needed for IPv6 because all addresses are public. Egress-only gateways provide this outgoing-only access that NAT gateways provide, without the incompatible elements of functionality.

Architecturally, they're otherwise the same as an IGW.

### VPC Flow Logs

VPC Flow Logs allows you to capture metadata about the traffic flowing in and out of networking interfaces within a VPC. Flow logs can be placed on a specific network interface, a subnet, or an entire VPC and will capture metadata fro mthe capture poit and anything within it. Flow logs aren't real-time and don't capture the actual traffic - only metadata on the traffic.

Flow logs capture: account-id, interface-id, srcaddr, dstaddr, srcport, dstport, protocol, packets, tytes, start, end, ation, and log-status.
  ![image](https://user-images.githubusercontent.com/8748075/96804802-89737200-146c-11eb-9a3d-7616df3bc840.png)

Flow logs don't capture some traffic, including Amazon DNS server, windowns license activation, DHCP traffic ,and VPC router
It can be enabled on a VPC, subnet, or ENI level and monitor traffic metadata for any included interfaces.

### VPN connection, VPNs

A VPN connection refers to the connection between your VPC and your own on-premises network.

VPC VPN Components:

- A virtual private Cloud (VPC)
- Virtual Private Gateway (VGW) attached to a VPC
- A customer gateway (CGW) - configuration for on-premises router
- VPN Connection (using 1 or 2 IPsec tunnels)

Best Practice & HA:

- Use dynamic VPNs (uses BGP) where possible
- Connect both Tunnels to your CGW - BPC VPN is HA by design
- Where possible use two VPN connections and two CGWs

AWS Site-to-site VPN

- By default, instances that you launch into an Amazon VPC can't communicate with your own (remote) network.
- You can enable access to your remote network from your VPC by creating an AWS Site-to-Site VPN (Site-to-Site VPN) connection, and configuring routing to pass traffic through the connection.
- Site-to-Site VPN supports Internet Protocol security (IPsec) VPN connections.

### AWS Direct Connect, DX

Direct Connect (DX) is a high-speed, low-latency physical connection providing access to public and private AWS services from your business premises. This lesson details its high-level architecture and the key points required for the exam.

A Direct Connect (DX) is a physical connection between your network and either directly via a cross-connect and customer router at a DX location or via a DX partner.

**Dedicated Connections** are direct via AWS and use single-mode fiber, running either 1 Gbps using 1000Base-LX or 10 Gbps using 10GBASE-LR.

Virtual interfaces (VIFs) run on top of a DX. Public VIFs can access AWS public services such as S3 only. Private VIFs are used to conenct into VPCs. DX is not highly available or encrypted.

### VPN and Direct Connect

Chossing between Direct Connect (DX) and VPC VPN is a critial part of any connectivity-based example questions.

VPC VPN

- Urgent need - can be deployed in minutes
- Cost constrained - cheap and economical
- Low end or consumer hardware - DX requires BGP, boarder gateway protocol
- Encryption required
- Flexibility to change locations
- Highly available options aavailable
- Short-term conenctivity (DX generally has physical minimums due to the physical transit conenctions requried) - not applicatble if you are in a DX location because then it's almost on demand

Direct Connect

- High throughput
- Consistent performance (throughput)
- consistent low latency
- large amounts of data - cheaper than VPN for higher volume
- No contention with existing internet connection

Both

- VPN as acheaper HA option for DX
- VPN as an additional layer of HA (in addition to two DX)
- if some form of connectivity is needed immediately, provides as it before the SX connection is live
- VPN Can be add ed to add encryption over the top of a DX (public VIF VPN)

## Amazon CloudFront

- CloudFront is an essential component for global applications.
- It speeds up distribution of your static and dynamic web content, such as .html, .css, .js, and image files, to your users.
- It's a content delivery network (CDN).
- A CDN is a glocal cache that stores copies of your data on edge caches, which are positioned as close to your customers as possible.
- Main benefits:

  - lower latency
  - higher transfer speeds
  - reduced load on the content server
  - more cost effective if your users access your objects frequently, CloudFront data transfer is lower than the price for Amazon S3 data transfer

CloudFront Components

- **Origin**: The server or service that hosts your content. Can be an S3 bucket, web server, or Amazon MediaStore
- **Distribution**: the "configuration" entity within CloudFront. It's where you configure all aspects of a specific "implementation" of CloudFront from.
- **Edge Location**: The lcoal infrastructure that hosts caches of your data. Positioned in over 150 locatins globally in over 30 countries.
- **Regional Edge Caches**: larger version of edge locations. Less of them but have more capacity and can serve larger areas.

Caching Process:

- Create a distribution and point at one or more origins. A distribution has a DNS address that is used to access it.
- The DNS Address directs clients at the closest available edge location.
- If the edge location has a cached copy of your data, it's delivered locally from that edge location.
- If it's not cached, the edge location attemptes to download it from either a regional cache or from the origin (known as an origin fetch)
- As the edge location, receives the data, it immediately begins forwarding it and caches it for the next visitor.

Content can expire, be discarded, and be recached. Or you can explicitly invalidate content to remove it from caches.

By default, CloudFront is fully publicly accessible - anyone with the DNS endpoint address can access content cached by the distribution.

A distribution can be configured to be **private** where each access requries a signed URL or cookie. This is done by setting the trusted signers on the distribution.

Private distributions can be bypassed by going straight to the origin (e.g., an S3 bucket).

An **origin access identity (OAI)** is a virtual identity that can be associated with a distribution. As S3 bucket can then be restricted to only allow this OAI to access it - all other identiteis can be denied.

It works with:

1. other AWS cloud service: Amazon S3 buckets, Amazon S3 static websites, Amazon Elastic Compute Cloud (Amazon EC2), and Elastic Load Balancing.
2. any non-AWS origin server, such as an existing on-premises web server
3. Amazon Route 53.

It supports all content that can be served over HTTP or HTTPS, including:

1. any popular static files that are a part of your web application, such as HTML files, images, JavaScript, and CSS files, and also audio, video, media files.
2. serving dynamic web pages, so it can actually be used to deliver your entire website
3. media streaming, using both HTTP and RTMP.

Three core concepts: distributions, origins,and cache control.

Amazon CloudFront Use Cases

Good for:

- Serving the Static Assets of Popular Websites
- Serving a Whole Website or Web Application. both dynamic and static content
- Serving Content to Users Who Are Widely Distributed Geographically
- Distributing Software or Other Large Files
- Serving Streaming Media

Not appropriate:

- All or Most Requests Come From a Single Location. you will not take advantage of multiple edge locations.
- All or Most Requests Come Through a Corporate VPN.

### Invalidate CloudFront Caches

By default, CloudFront caches a response from Amazon S3 for 24 hours (Default TTL of 86,400 seconds). If your request lands at an edge location that served the Amazon S3 response within 24 hours, CloudFront uses the cached response even if you updated the content in Amazon S3.

push the updated S3 content from CloudFront:

- Invalidate the S3 objects:
  - the next request retrieves the object directly from Amazon S3.
  - Each AWS account is allowed 1,000 free invalidation paths per month
- Use object versioning
  - use if update content frequently
  - you can revert changes because the previous version of the object remains in Amazon S3 under the previous name
  - equires more Amazon S3 storage.

## Amazon Route 53

It's a highly available and scalable cloud DNS web service to route end users to Internet applications.

three main functions:

1. Domain registration.
   It **isn’t required** to use Amazon Route 53 as your DNS service or to configure health checking for your resources.

2. DNS service: translates friendly domain names into IP address.

   - with Amazon Route 53 Domain: automatically configured as the DNS service for the domain, and a hosted zone will be created for your domain. You add resource record sets to the hosted zone, which define how you want Amazon Route 53 to respond to DNS queries for your domain.

   - with another domain registrar: You can transfer DNS service to Amazon Route 53, with or without transferring registration for the domain

3. Health checking

   - Health checks and DNS failover are major tools in the Amazon Route 53 feature set that help make your application highly available and resilient to failures.
   - Amazon Route 53 health checks are not triggered by DNS queries; they are run periodically by AWS, and results are published to all DNS servers.

### Active-active and active-passive failover

- Active-active failover
  - use it when you want all of your resources to be available the majority of the time.
  - When a resource becomes unavailable, Route 53 can detect that it's unhealthy and stop including it when responding to queries.
- Active-passive failover
  - use it when you want a primary resource or group of resources to be available the majority of the time and you want a secondary resource or group of resources to be on standby in case all the primary resources become unavailable.
  - When responding to queries, Route 53 includes only the healthy primary resources. If all the primary resources are unhealthy, Route 53 begins to include only the healthy secondary resources in response to DNS queries.

### Amazon Route 53 basic

DNS Terms

- DNS Root Servers: Trust starts somewhere. The DNS root servers are that trust - a group of servers that are authoriative to give answers about the root zone. TLDs are controlled by the root zone.
- Top-Level Domain (TLD0: The top tier in the DNS hierarchy. Generally structured into geographic codes - such as `.au`, `.us`, `.uk` - and generic TKDs - such as `.com`. `.org` and `.edu`. large orgs or country orgs are delegated control of these by the root servers to be authoritative.
- Subdomain: Anyting between a host and a TLD is a subdomain. Anorganization is delegated control of subdomains and is authoritative.
- Zone and Zone File: A zone or zone file is a mapping of OPs and hosts for a given subdomain. The zone file for linuxacademy.com would contrain a record for www.
- Records: DNS has lots of record tyes - A, MZ, AAAA, CNAME. TXT, NS
- Name Server: A name server is a server that runs a DNS service and can either store or cache information for the DNS platform. Whether a name server caches or acts as an authority depends on if it's referenced from a higher level.
- Authoritative:
- The root servers are authoritative for the root zone - they are trusted by every operating system and networking stack globally. The root servers delegate ownership of a part of the hierarchy, such as `.com`, to an organization. That organization runs name servers that become authoritative - they can answer queries with authority. Because the root points at these servers, they are authoritative. These `.com` name servers can point at servers for sub domains that then become authoritative.
- Hosts: A record in a zone file
- FQDN: Fully qualified domain name - the host and domains: www.linuxacademy.com

DNS Flow

use `linuxacademy.com` as an example. The domain name system (DNS) does many things, but the common use case is to turn DNS names into IP address - like turning linuxcademay.com into `52.86.183.13`. It's a distributed system - no one part knows all.

1. Step 1: Query your ISP. If it doesn't know, it handles it for ou.
2. Step 2: The ISP queries the DNS root servers. If they don't know, they help by providing servers authoritative for `.com`.
3. Step 3: The `.com` servers are queried. If they don't have an IP, they provide the linuxacademy.com authoritative servers.
4. Step 4: These servers are run by LA. They will know and return one of more IPs.

Registering a domain with DNS in Route 53

1. Step 1: Check the domain is available.
2. Step 2: Purchase the domain via a registrar
3. Step 3: hosting the domain.
4. Step 4: Records in the zone file:

DNS zones

A zone or hsoted zone is a container for DNS records relating to a particular domain. Route 53 supports public hosted zones, which influence the domain that is visible from the internet and VPCs. Private hosted zones are similar but accessible only from the VPCs they're associated with.

Public Zones

- a public hosted zone is created when you register a domain with Route 53, when you transfer a domain into Route 53, or if you created on manually
- a hosted zone has the same name as the domain it relates to - e.g., linuxacademy.com will have a hosted zone called linuxacademy.com
- a public zone is accessible either from internet-based DNS clients or from with any AWS VPCs.
- A hosted zone will have "name servers" - these are the IP addresses you can give to a domain operator, so Route 53 becomes "authoritative" for a domain.

Private Zones;

- Private zones are created manually and associated with one or more VPCs - they're only accessible from those VPCs.
- pribate zones need `enableDnsHostnames` and `enableDnsSupport` enabled on a VPC.
- Not all route 53 features supported - limits on healthchecks
- **split-view DNS**is supported, suign the same zone name for public and private zones - providing VPC resources with differenct records, e.g., testing ,internal versions of websites. With split view, private is preferred, if no matches, public is used.

DNS Record Set Types

- A Record (and AAAA): for a given host (wwww), an A record provides an IPv4 address and an AAAA provides an IPv6 address.
- CNAME Record: allows aliases to be created (not the same as alias record). A machine might have CNAMES for `www`, `ftp` and images. Each of these CNAMEs oints at an existing record in the domain. CNAMES cannot be used at the APEX of a domain.
- MX Record: it provides the mail servers for a given domain. Each MX record has a priority. Remote mail server use this to locate the server to use when sending emails.
- NS Record: used to set the authoritative servers for a subdomain.
- TXT record: used for descriptive text in a domain - often used to verify domain ownership
- Alias Records: An extension of CNAME. Can refer to AWS logical services (load balancers, S3 buckets) and AWS doesn't charge for queries of alias records against AWS resources.

### Route 53 Health Checks

It's used to influence route 53 routing decisions.

- health checks that monitor the health of an endpoint - e.g., IP address or hostname
- health checks that monitor the health of another health check (calculated health checks)
- health checks that monitor CloudWatch alarms - you might want to consider something unhealthy if your DynamoDB table is experiencing performance issues.

Route 53 health Checkers:

- Global health check system that checks an endpoint in an agreed way with an agreed frequency.
- **>18%** of checks report healthy = healthy, **<18%** health = unhealthy

Types

- Http, https: connection check in less than four seconds. Report 2xx or 3xx code within 2 seconds.
- TCP: connection within 10 seconds
- Http/s with string match: all the checksas with Http/s but the body is checked for a string match

Route 53 and Health Checks

- Records can be linked to health checks. If the check is unhealthy, the record isn't used.
- Can be used to do failover and other routing architectures.

### Route 53 Routing Policy

It determines how Amazon Route 53 responds to queries:

- Simple Routing Policy:
  - A simple routing policy is a single recordw ithin a hosted zone that contains one or more values. When queried, a simple routing policy record returns all the values in a randomized order.
  - use for a single reource that performs a given function for your domain. E.g., a web server that serves content for the `example.com` website.
  - CANNOT: create nultiple records that have the same name and type
  - CAN: specify multiple values in the same record, e.g., multiple IP address.
  - The DNS client (the laptop) receives a randomized list of IPs as a result. The client can select the appropriate one and initiate an HTTP session with a resource.
  - **Pros**: Simple, the default, even spread ofrequests
  - **Cons**: No performance control, no granular health checks, for alias type - only a sinle AWS resource.
- Failover routing policy
  - it allows you to create two records with the same name. One is designated as the primary and another as secondary. Queries will resolve to the primamry - unless it's unhealthy, in which case Route 53 will respond with the secondary.
  - use when you want to configure active-passive failover.
  - used in conjunction with Route 53 health checks to provide failover between a primary record and a secondary record.
  - Failover can be combined with other types to allow multiple primary and secondary records. Generally, failover is used to provide emergency resources during failures. Like a page says website is under maintenance.
- Weighted routing policy
  - allow granular control over queries, allowing a certain percentage of queries to reach specific records.
  - used to control the amount of traffic that reaches specific resources.
  - useful when testing new software or when resources are being added or removed from a configuration that doesn't use a load balancer.
  - Records are returned based on a ratio of their weight to the total weight, assuing records are healthy.
- Latency routing policy
  - allows clients to be matched to resources with the lowest latency
  - use when you have resources in multiple AWS Regions and you wnat to route traffic to the region that provides the best latency
  - Route53 consults a latency database each time a request occurs to a given latency-based host in DNS from a resolver server. Record sets with the same name are considered part of the same latency-based set. Each is allocated to a region. The record set returned is the one with the lowest latency to the resolver server.
- Geolocation routing policy
  - use when you want to route traffic based on the location of your users.
  - A no-result is returned if no match exists between a record set and the query location. Geoproximity allows a bias to expand a geographic area.
- Geoproximity routing policy
  - use when you want to route traffic based on the location of your resources and, optionally, shift traffic from resources in one location to resources in another.
- Multivalue answer routing policy
  - use when you want Route 53 to respond to DNS queries with up to eight healthy records selected at random.

Simply put:

1. Simple routing policy – Use for a single resource that performs a given function for your domain, for example, a web server that serves content for the example.com website.
2. Failover routing policy – Use when you want to configure active-passive failover.
3. Weighted routing policy – Use to route traffic to multiple resources in proportions that you specify.
4. use multivalue answer routing when you want to associate your routing records with a Route 53 health check

## Amazon Load Balancing

- Load balancing is a method used to distribute incoming conenctions across a group o servers of services.
- Incoming connections are made to the load balancer, which distributes them to associated services.
- Elastic Load Balancing (ELB) is a service that provides a set of highly available and scalable load balancers in one of three versions:
  - Classic: CLB
  - Application: ALB
  - Network: NLB
- ELBs can be paired with Auto Scaling groups to enhance high availability and fault tolerance - automating scaling/elasticity
- An elastic load balancer has a DNS record, which allows access at the external side.

A node is placed in each AZ the load balancer is active in. Each node gets 1/N of the traffic, where N is the number of nodes. Historically, each node could only load balance to instances in the same AZ. The reuslts in uneven traffic distribution. Cross-zone load balancing allows each node to distribute traffic to all instances.

An elastic load balancer can be public facing, meaning it accepts traffic from the public internet, or internal, which is only accessible from inside a VPC and is often used between application tiers.

An elastic load balancer accepts traffic via listeners using proteocol and ports. It can strip HTTPS at this point, meaning it handles encryption/decryption, reducing CPU usage on instances.

### Classic Load Balancer, Amazon CLB

Classic Load Balancers are the oldest type of load balancer and generally should be avoid for new projects.

- support layer 3 &4 (TCP and SSL) and some HTTP/S features
- it isn't a layer 7 device, so no real HTTP/S
- one SSL certificate per CLB - can get expensive for complex projects
- can **offload** SSL connections - HTTPS to the load balancer and HTTP to the instance (lower CPU and admin overhead on instances)
- can be associated with Auto Scaling groups
- DNS A record is uded to conenct to the CLB

### Application Load Balancer, ALB

Application Load Balancers (ALBs) are devices that operate at Layer 7 of the OSI network model — understanding the HTTP/S protocol. In addition, ALBs introduce a number of advanced features that result in a cost reduction, performance increase, and added flexibility. ALBs are, in most cases, the recommended load balancer to use for projects.

- ALBs operate at layer 7 of the OSI model. They undertand HTTP and HTTPS and can load balance based on this protoccol layer.
- ALBs are now **recommended as the default** LB for VPCs. They perform better than CLBs and are almost always cheaper.
- ALBs are also support two additional protocols: **WebSocket** and **HTTP/2**.
- **Content-Based Routing**: rules can direct certain traffic to specific target groups.
  - Host-based rules: Route traffic based on the host used
  - Path-based ruels: Route traffic based on URL path
- ALBs support EC2, ECS, EKS, Lambda, HTTPS, HTTP/2 and WebSockets, and they can be integrated with AWS Web Application Firewall (WAF).
- **Containerized Application Support**: ECS, EKS. Use an ALB if you need to use containers or microservices.
- Targets -> target groups -> content rules
- host multiple secure (HTTPS) applications, each with its own SSL certificate, behind one ALB using Server Name Indication (SNI).

### Network Load Balancer, NLB

NLBs are the newest type of load balancer and operate at **layer 4** of the OSI network model. There are a few scenarios and benefits to using an NLB versus an ALB:

- **Connection-Based Load Balancing**
- Best local balancing **performance** within AWS
  - **Less latency** because no processing above layer 4 is required
  - **High Throughput**
- Can support protocols other than HTTP/S because it forwards upper layers unchanged
- IP addressable - static address
- Source IP address preservation - packets unchagned
- Targets can be addreseed using IP address
- Supports SNI too (as ALB)! This allows SaaS applications and hosting services to run behind the same load balancer, improving your service security posture, and simplifying management and operations.

-> NLB ->

- TCP 80 ->
  - 10.0.1.126
  - 10.0.1.128
- TCP 8080 ->
  - 10.0.2.126
  - 10.0.2.128

### Launch templates and Lunch configurations

They allow you to configure various configuration attributes that can be set include:

- AMI to use for EC2 launch
- Instance type
- Storage
- Key pair
- IAM role
- User data
- Purchase options
- newwork configuration
- Security group(s)

Launch templates address some of the weaknesses of the legacy launch configurations and add the following features:

- Versioning and inheritance
- Tagging
- More advanced purchasing options
- new instance features, like:
  - Elastic graphics
  - T2/T3 unlimited settings
  - Placement groups
  - Capacity reservations
  - Tenacy options

Launch templates should be used over launch configurations where possible. Neither can be edited after creation - a few version of the template or a new launch configuration should be created.

### EC2 Placement Groups

When you launch a new EC2 instance, the EC2 service attempts to place the instance in fllowing ways:

- Cluster – packs instances close together inside an Availability Zone. This strategy enables workloads to achieve the low-latency network performance necessary for tightly-coupled node-to-node communication that is typical of HPC applications.
- Partition – spreads your instances across logical partitions such that groups of instances in one partition do not share the underlying hardware with groups of instances in different partitions. This strategy is typically used by large distributed and replicated workloads, such as Hadoop, Cassandra, and Kafka.
- Spread – strictly places a small group of instances across distinct underlying hardware to reduce correlated failures.

### Auto Scaling Groups

Auto Scaling groups allow EC2 instances to scale in a way that allows elasticity. When used in conjunction with load balancers and launch templates and configurations, it allows for a self-healing infrastructure that can also scale based on demand.

Auto Scaling groups use launch configurations or launch templates and allow automatic scale-out or scale-in based on configurable metrics. Auto Scaling groups are often paired with elastic load balancers.

Auto Scaling groups can be configured to use multiple AZs to improve high availability. Unhealthy instances are terminated and recreated. ELB health checks or EC2 status can be used.

Metrics such as CPU unilization or network transfer can be used either to scale out or scal in using scaling policies. Scaling can be manaul, scheduled, or dynamic. Cooldowns can be defined to ensure rapid in/out events don't occur.

Scaling policies can be simple, step scaling, or target tracking.

### Auto scaling vs. Termination Policy

- scaling out: adds instances
- scaling in: removes instances

Default Termination Policy

1. Determine which Availability Zones have the **most instances**, and at least one instance that is not protected from scale in.
2. Determine which instance. EC2 Auto Scaling tries to gradually shift the On-Demand Instances away from instance types that are lower priority.
3. Determine whether any of the instances use the oldest launch template or configuration
4. if there are multiple unprotected instances to terminate, determine which instances are closest to the next billing hour

### Route 53 vs. ELB

|Route 53 | ELB |
|---|---|
|Route 53 routes domain traffic to ELB load balancer  | distribute traffic to each EC2 instances |
|help balance traffic 'across' regions  | within one region |
|only changes the address that your clients' requests resolve to  |ELB actually reroutes traffic  |
|have to either manually replace the old failed instance with the new one in the route or add some script to your launch configuration to automatically register the new instance with Route53 and remove the failed one.  |can use autoscaling to automatically register new instances added to the group  |

### Monitoring Load Balancer

- CloudWatch metrics
  - use Amazon CloudWatch to retrieve statistics about data points for your load balancers and targets as an ordered set of time-series data, known as metrics.
  - use these metrics to verify that your system is **performing as expected**
- Access logs
  - use access logs to capture detailed information about the requests made to your load balancer and store them as log files in Amazon S3.
  - use these access logs to analyze **traffic patterns** and to **troubleshoot issues** with your targets.
- Request tracing
  - use request tracing to track HTTP requests.
  - The load balancer adds a header with a trace identifier to each request it receives.
- CloudTril logs
  - capture detailed information about the calls made to the Elastic Load Balancing API and store them as log files in Amazon S3.
  - to determine which calls were made, the source IP address where the call came from, who made the call, when the call was made, and so on

## References

- [Linux Academy: AWS Certified Solutions Architect - Associate Level](https://linuxacademy.com/course/aws-certified-solutions-architect-2019-associate-level)
- [AWS Certified SAA 2018 - Exam Feedback](https://acloud.guru/forums/aws-certified-solutions-architect-associate/discussion/-KSDNs4nfg5ikp6yBN9l/exam_feedback_-_20_specific_po)
- [AWS Net working best practices](http://aws.amazon.bokecc.com/news/show-2441.html)
