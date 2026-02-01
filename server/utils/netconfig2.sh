THISDIR=$(dirname "$0")

# clear existing rules
iptables -F INPUT
ip6tables -F INPUT

# DON'T FUCKING FORGET TO MOVE SSH TO 3939
# allow ssh
iptables -A INPUT -p TCP --dport 3939 -j ACCEPT

# allow connecting only on nginx ports
iptables -A INPUT -p tcp -m multiport --dports http,https -j ACCEPT
ip6tables -A INPUT -p tcp -m multiport --dports http,https -j ACCEPT
# allow direct mirror connections
iptables -A INPUT --src 185.139.68.249 -p tcp -m multiport --dports 3000 -j ACCEPT
ip6tables -A INPUT --src 2a04:5200:fff5::1337 -p tcp -m multiport --dports 3000 -j ACCEPT

# accept local and output connections
iptables -A INPUT -i lo -j ACCEPT
iptables -P OUTPUT ACCEPT

ip6tables -A INPUT -i lo -j ACCEPT
ip6tables -P OUTPUT ACCEPT

# also already established connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

ip6tables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# some additional rules to block evil packets
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP
iptables -A INPUT -p tcp ! --syn -m state --state NEW -j DROP

ip6tables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP
ip6tables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP
ip6tables -A INPUT -p tcp ! --syn -m state --state NEW -j DROP

# allow mysql connections for remote control
iptables -A INPUT -p TCP --src 46.0.0.0/8 --dport 3306 -j ACCEPT

# block all connections by default
iptables -P INPUT DROP
iptables -P FORWARD DROP

ip6tables -P INPUT DROP
ip6tables -P FORWARD DROP

# save this rules to persistent
iptables-save > /etc/iptables/rules.v4
ip6tables-save > /etc/iptables/rules.v6